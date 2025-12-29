import time
import asyncio
import torch
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from torch_geometric.loader import DataLoader
from torch_geometric.data import Batch
from rdkit import Chem

# Modules
from modules.ai_model import load_ai_model, DEVICE
from modules.chemistry import get_protein_sequence, process_data_object, get_smiles_from_input, get_pharmacophore_data
from modules.database import get_all_drugs
from modules.admet import calculate_admet_properties
from modules.utils import calculate_confidence
from modules.llm_engine import generate_scientific_explanation, chat_with_drug_data
from modules.task_manager import create_task, update_progress, set_task_result, set_task_error
from modules.config import MODEL_PATH

router = APIRouter()
model = load_ai_model(MODEL_PATH)

class DrugAnalysisRequest(BaseModel):
    target_id: str
    smiles: Optional[str] = None
    mode: str

def run_analysis_task(task_id: str, request_data: dict):
    """
    Background task to run the analysis logic.
    This runs in a thread pool (via FastAPI BackgroundTasks) to avoid blocking the event loop.
    """
    try:
        update_progress(task_id, 0, "Initializing Analysis...")
        
        target_id = request_data.get('target_id')
        mode = request_data.get('mode')
        input_smiles = request_data.get('smiles')
        
        protein_seq = get_protein_sequence(target_id)
        if not protein_seq:
            set_task_error(task_id, f"Invalid Target ID '{target_id}'")
            return

        # --- MANUAL MODE ---
        if mode == 'manual':
            update_progress(task_id, 10, "Processing Molecule...")
            if not input_smiles:
                set_task_error(task_id, "Input is missing!")
                return

            real_smiles, mol = get_smiles_from_input(input_smiles)
            if not real_smiles or not mol:
                set_task_error(task_id, f"Could not find structure for '{input_smiles}'.")
                return

            display_name = input_smiles
            if input_smiles == real_smiles:
                 display_name = f"Custom Ligand {str(int(time.time()))[-4:]}"
            else:
                 display_name = input_smiles

            update_progress(task_id, 30, "Running AI Inference...")
            score = 0.0
            status = "UNKNOWN"
            data = process_data_object(real_smiles, protein_seq)

            if model and data:
                try:
                    batch = Batch.from_data_list([data])
                    with torch.no_grad():
                        raw = model(batch.to(DEVICE)).item()
                        score = round(max(4.0, min(12.0, raw)), 2)
                        status = "ACTIVE" if score > 7.5 else "INACTIVE"
                except: status = "MODEL ERROR"

            update_progress(task_id, 60, "Calculating ADMET...")
            admet_data = calculate_admet_properties(mol)
            confidence_val = calculate_confidence(score, threshold=7.5)
            pharmacophore_data = get_pharmacophore_data(mol)

            update_progress(task_id, 80, "Generating Explanation...")
            ai_explanation = generate_scientific_explanation(
                drug_name=display_name,
                smiles=real_smiles,
                score=score,
                admet=admet_data,
                active_sites=pharmacophore_data
            )

            result = {
                "name": display_name,
                "smiles": real_smiles,
                "score": score,
                "status": status,
                "confidence": confidence_val,
                "color": "#00f3ff" if status == "ACTIVE" else "#ff0055",
                "admet": admet_data,
                "active_sites": pharmacophore_data,
                "ai_explanation": ai_explanation
            }
            set_task_result(task_id, result)

        # --- AUTO MODE ---
        elif mode == 'auto':
            update_progress(task_id, 5, "Fetching Database...")
            all_drugs = get_all_drugs()
            total_drugs = len(all_drugs)
            
            data_list = []
            valid_indices = []
            
            update_progress(task_id, 10, f"Analyzing {total_drugs} candidates...")

            # Use a smaller subset for "fake" speed or process properly?
            # Ideally we process all, but let's batch it.
            for i, drug in enumerate(all_drugs):
                d_obj = process_data_object(drug['smiles'], protein_seq)
                if d_obj:
                    data_list.append(d_obj)
                    valid_indices.append(i)

                if i % 50 == 0:
                    prog = 10 + int((i / total_drugs) * 40) # 10% to 50%
                    update_progress(task_id, prog, f"Processing {i}/{total_drugs}...")
                    # Allow other threads to run
                    time.sleep(0.0001)

            results = []
            all_scores = []

            update_progress(task_id, 50, "Running AI Inference Batch...")
            if model and data_list:
                loader = DataLoader(data_list, batch_size=64, shuffle=False)
                total_batches = len(loader)
                with torch.no_grad():
                    for i, batch in enumerate(loader):
                        try:
                            all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                        except:
                            all_scores.extend([0.0]*batch.num_graphs)

                        prog = 50 + int((i / total_batches) * 40) # 50% to 90%
                        update_progress(task_id, prog, "Inference Running...")
                        time.sleep(0.0001)

            update_progress(task_id, 90, "Finalizing Results...")

            for idx, score_val in zip(valid_indices, all_scores):
                final_score = round(max(4.0, min(12.0, score_val)), 2)
                results.append({
                    "name": all_drugs[idx]["name"],
                    "smiles": all_drugs[idx]["smiles"],
                    "score": final_score,
                    "confidence": calculate_confidence(final_score),
                    "status": "ACTIVE" if final_score > 7.5 else "INACTIVE",
                    "color": "#00f3ff" if final_score > 7.5 else "#ff0055"
                })

            results.sort(key=lambda x: x["score"], reverse=True)
            set_task_result(task_id, {"results": results, "scan_time": 0}) # scan_time can be calculated at end

    except Exception as e:
        print(f"Task Error: {e}")
        set_task_error(task_id, str(e))

def run_upload_task(task_id: str, target_id: str, file_content: bytes, filename: str):
    """Background task for processing uploaded files."""
    try:
        update_progress(task_id, 0, "Reading File...")
        protein_seq = get_protein_sequence(target_id)
        if not protein_seq:
            set_task_error(task_id, "Invalid Target ID")
            return

        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(file_content))
        elif filename.endswith('.txt'):
            df = pd.read_csv(io.BytesIO(file_content), sep='\t')
        else:
            set_task_error(task_id, "Invalid format. Only .csv or .txt allowed.")
            return

        df.columns = [c.lower().strip() for c in df.columns]
        if 'smiles' not in df.columns:
            set_task_error(task_id, "Column 'smiles' not found!")
            return
        if 'name' not in df.columns:
            df['name'] = [f"Drug_{i}" for i in range(len(df))]

        drugs_data = df.to_dict(orient='records')
        total = len(drugs_data)

        update_progress(task_id, 10, f"Processing {total} molecules...")
        
        data_list = []
        valid_indices = []

        for i, row in enumerate(drugs_data):
            d_obj = process_data_object(row['smiles'], protein_seq)
            if d_obj:
                data_list.append(d_obj)
                valid_indices.append(i)

            if i % 10 == 0:
                prog = 10 + int((i / total) * 40)
                update_progress(task_id, prog, f"Processing {i}/{total}...")
                time.sleep(0.0001)

        if not data_list:
            set_task_error(task_id, "No valid molecules found.")
            return

        all_scores = []
        update_progress(task_id, 50, "Running AI Inference...")

        if model and data_list:
            loader = DataLoader(data_list, batch_size=64, shuffle=False)
            total_batches = len(loader)
            with torch.no_grad():
                for i, batch in enumerate(loader):
                    try:
                        all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                    except:
                        all_scores.extend([0.0]*batch.num_graphs)

                    prog = 50 + int((i / total_batches) * 40)
                    update_progress(task_id, prog, "Inference...")
                    time.sleep(0.0001)
        else:
            all_scores = [0.0] * len(data_list)

        update_progress(task_id, 90, "Compiling Results...")
        results = []

        for idx, score_val in zip(valid_indices, all_scores):
            final_score = round(max(4.0, min(12.0, score_val)), 2)
            row = drugs_data[idx]
            
            admet_data = {}
            active_sites = [] 

            if final_score > 7.5:
                mol = Chem.MolFromSmiles(row['smiles'])
                admet_data = calculate_admet_properties(mol)
                active_sites = get_pharmacophore_data(mol)

            results.append({
                "name": str(row['name']),
                "smiles": str(row['smiles']),
                "score": final_score,
                "confidence": calculate_confidence(final_score),
                "status": "ACTIVE" if final_score > 7.5 else "INACTIVE",
                "color": "#00f3ff" if final_score > 7.5 else "#ff0055",
                "admet": admet_data,
                "active_sites": active_sites 
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        set_task_result(task_id, {"results": results, "scan_time": 0})

    except Exception as e:
        set_task_error(task_id, f"Upload Processing Error: {str(e)}")


# --- ENDPOINTS ---

@router.post("/analyze")
async def analyze_drug(request: DrugAnalysisRequest, background_tasks: BackgroundTasks):
    task_id = create_task()
    background_tasks.add_task(run_analysis_task, task_id, request.dict())
    return {"task_id": task_id, "status": "Queued"}

@router.post("/upload")
async def upload_file(background_tasks: BackgroundTasks, target_id: str = Form(...), file: UploadFile = File(...)):
    task_id = create_task()
    content = await file.read()
    background_tasks.add_task(run_upload_task, task_id, target_id, content, file.filename)
    return {"task_id": task_id, "status": "Queued"}

class ChatRequest(BaseModel):
    question: str
    drug_context: dict

@router.post("/chat_drug")
async def chat_drug(request: ChatRequest):
    answer = chat_with_drug_data(request.question, request.drug_context)
    return {"answer": answer}
