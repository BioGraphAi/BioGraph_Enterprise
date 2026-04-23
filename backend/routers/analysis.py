import time
import torch
import io
import uuid
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
from modules.state import update_progress, get_progress
# ✅ FIX: Import correct instance
from modules.llm_engine import llm_bot 

router = APIRouter()
model = load_ai_model("drug_model_v4.pt")

class DrugAnalysisRequest(BaseModel):
    target_id: str
    smiles: Optional[str] = None
    mode: str
    task_id: Optional[str] = None

@router.get("/progress/{task_id}")
async def fetch_progress(task_id: str):
    return get_progress(task_id)


async def run_analysis_task(task_id: str, request: DrugAnalysisRequest):
    try:
        update_progress(task_id, current=0, total=1, status="Validating...")
        
        start_time = time.time()
        protein_seq = await get_protein_sequence(request.target_id)
        
        if not protein_seq:
            update_progress(task_id, status="FAILED", error=f"Invalid Target ID '{request.target_id}' or Network Error")
            return

        # --- MANUAL MODE ---
        if request.mode == 'manual':
            update_progress(task_id, status="Processing...")
            if not request.smiles: 
                update_progress(task_id, status="FAILED", error="Input is missing!")
                return
            
            real_smiles, mol = get_smiles_from_input(request.smiles)
            if not real_smiles or not mol:
                update_progress(task_id, status="FAILED", error=f"Could not find structure for '{request.smiles}'.")
                return

            is_smiles_input = request.smiles.strip() == real_smiles or len(request.smiles) > 20
            display_name = f"Custom Ligand {str(int(time.time()))[-4:]}" if is_smiles_input else request.smiles

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
                except Exception as e:
                    print(f"Model Error: {e}")
                    status = "MODEL ERROR"
            
            admet_data = calculate_admet_properties(mol)
            confidence_val = calculate_confidence(score, threshold=7.5)
            pharmacophore_data = get_pharmacophore_data(mol)

            # ✅ FIX: Correct AI Call using the new class method
            drug_data_for_ai = {
                "name": display_name,
                "smiles": real_smiles,
                "score": score,
                "admet": admet_data,
                "active_sites": pharmacophore_data
            }
            ai_explanation = llm_bot.analyze_drug(drug_data_for_ai, request.target_id)

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
            update_progress(task_id, current=1, status="Done", result=result)

        # --- AUTO MODE ---
        elif request.mode == 'auto':
            update_progress(task_id, status="Fetching DB...")
            all_drugs = get_all_drugs()
            update_progress(task_id, total=len(all_drugs))
            
            data_list = []
            valid_indices = []
            
            update_progress(task_id, status="Analyzing...")
            for i, drug in enumerate(all_drugs):
                d_obj = process_data_object(drug['smiles'], protein_seq)
                if d_obj:
                    data_list.append(d_obj)
                    valid_indices.append(i)
                
                if i % 20 == 0:
                    current_drug = all_drugs[i]['name']
                    update_progress(task_id, current=i, status=f"Scanning: {current_drug}")

            results = []
            all_scores = []
            
            update_progress(task_id, status="Inference...")
            if model and data_list:
                loader = DataLoader(data_list, batch_size=64, shuffle=False)
                with torch.no_grad():
                    for batch in loader:
                        try:
                            all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                        except Exception as e:
                            print(f"Batch inference error: {e}")
                            all_scores.extend([0.0]*batch.num_graphs)
            
            update_progress(task_id, current=len(all_drugs), status="Finalizing...")

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
            update_progress(task_id, status="Done", result={"results": results, "scan_time": round(time.time() - start_time, 2)})

    except Exception as e:
        print(f"❌ Analysis Task Error: {e}")
        update_progress(task_id, status="FAILED", error=str(e))

# --- 1. ANALYZE ENDPOINT ---
@router.post("/analyze")
async def analyze_drug(request: DrugAnalysisRequest, background_tasks: BackgroundTasks):
    task_id = request.task_id or str(uuid.uuid4())
    update_progress(task_id, current=0, total=1, status="Starting...")
    background_tasks.add_task(run_analysis_task, task_id, request)
    return {"task_id": task_id, "message": "Analysis started in background"}


async def run_upload_task(task_id: str, target_id: str, contents: bytes, filename: str):
    try:
        update_progress(task_id, current=0, total=1, status="Reading File...")
        
        protein_seq = await get_protein_sequence(target_id)
        if not protein_seq:
            update_progress(task_id, status="FAILED", error="Invalid Target ID")
            return

        start_time = time.time()
        results = []

        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith('.txt'):
            df = pd.read_csv(io.BytesIO(contents), sep='\t')
        else:
            update_progress(task_id, status="FAILED", error="Invalid format. Only .csv or .txt allowed.")
            return

        df.columns = [c.lower().strip() for c in df.columns]
        if 'smiles' not in df.columns:
            update_progress(task_id, status="FAILED", error="Column 'smiles' not found!")
            return
        if 'name' not in df.columns: 
            df['name'] = [f"Drug_{i}" for i in range(len(df))]

        drugs_data = df.to_dict(orient='records')
        update_progress(task_id, total=len(drugs_data), status="Analyzing Batch...")
        
        data_list = []
        valid_indices = []

        for i, row in enumerate(drugs_data):
            d_obj = process_data_object(row['smiles'], protein_seq)
            if d_obj:
                data_list.append(d_obj)
                valid_indices.append(i)
            if i % 10 == 0:
                update_progress(task_id, current=i)

        if not data_list:
            update_progress(task_id, status="FAILED", error="No valid molecules found.")
            return

        all_scores = []
        if model and data_list:
            loader = DataLoader(data_list, batch_size=64, shuffle=False)
            with torch.no_grad():
                for batch in loader:
                    try:
                        all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                    except Exception as e:
                        print(f"Batch upload inference error: {e}")
                        all_scores.extend([0.0]*batch.num_graphs)
        else: 
            all_scores = [0.0] * len(data_list)

        update_progress(task_id, current=len(drugs_data), status="Finalizing...")

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
        update_progress(task_id, status="Done", result={"results": results, "scan_time": round(time.time() - start_time, 2)})

    except Exception as e:
        print(f"❌ Upload Error: {e}")
        update_progress(task_id, status="FAILED", error=f"Failed to process file: {str(e)}")

# --- 2. UPLOAD ENDPOINT ---
@router.post("/upload")
async def upload_file(background_tasks: BackgroundTasks, target_id: str = Form(...), task_id: Optional[str] = Form(None), file: UploadFile = File(...)):
    tid = task_id or str(uuid.uuid4())
    contents = await file.read()
    update_progress(tid, current=0, total=1, status="Reading File...")
    background_tasks.add_task(run_upload_task, tid, target_id, contents, file.filename)
    return {"task_id": tid, "message": "Upload processing started in background"}


class ChatRequest(BaseModel):
    question: str
    drug_context: dict

@router.post("/chat_drug")
async def chat_drug(request: ChatRequest):
    # ✅ FIX: Call instance method
    answer = llm_bot.chat_with_drug(request.question, request.drug_context)
    return {"answer": answer}