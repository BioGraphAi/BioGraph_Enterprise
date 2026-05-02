import psutil
import platform
import torch
from fastapi import APIRouter, Response
from pydantic import BaseModel
from rdkit.Chem import Draw
from urllib.parse import unquote
from modules.chemistry import get_smiles_from_input
from modules.state import get_progress
from modules.logger import logger
from modules.llm_engine import llm_bot

router = APIRouter()

@router.get("/")
def read_root():
    return {
        "status": "online", 
        "engine": "BioGraph Enterprise v2.0",
        "platform": platform.system(),
        "arch": platform.machine()
    }

@router.get("/stats")
def get_system_stats():
    """
    Expert-level system health monitoring.
    """
    cpu_usage = psutil.cpu_percent(interval=None)
    memory = psutil.virtual_memory()
    
    # GPU Stats if available
    gpu_info = "Not Available"
    if torch.cuda.is_available():
        gpu_info = {
            "name": torch.cuda.get_device_name(0),
            "memory_allocated": f"{torch.cuda.memory_allocated(0) / 1024**2:.2f} MB",
            "memory_reserved": f"{torch.cuda.memory_reserved(0) / 1024**2:.2f} MB"
        }
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        gpu_info = "Apple Silicon (MPS) Active"

    return {
        "cpu": f"{cpu_usage}%",
        "ram": f"{memory.percent}% ({memory.used // 1024**2}MB / {memory.total // 1024**2}MB)",
        "gpu": gpu_info,
        "os": f"{platform.system()} {platform.release()}"
    }

@router.get("/progress/{task_id}")
def fetch_progress(task_id: str):
    prog = get_progress(task_id)
    if prog["total"] == 0:
        return {"progress": 0, "status": prog.get("status", "Idle"), "current": 0, "total": 0}
    
    perc = int((prog["current"] / prog["total"]) * 100)
    return {
        "progress": perc, 
        "status": prog["status"],
        "current": prog["current"],
        "total": prog["total"],
        "result": prog.get("result"),
        "error": prog.get("error")
    }

@router.get("/molecule_image")
def get_molecule_image(smiles: str):
    try:
        decoded_smiles = unquote(smiles).strip()
        real_smiles, mol = get_smiles_from_input(decoded_smiles)
        
        if not mol: 
            logger.warning(f"Image generation failed: Invalid SMILES {decoded_smiles}")
            return Response(content="Invalid SMILES", status_code=400)
        
        drawer = Draw.MolDraw2DSVG(400, 400)
        opts = drawer.drawOptions()
        opts.addStereoAnnotation = True
        opts.prepareMolsBeforeDrawing = True
        # Transparent background for better UI integration
        opts.setBackgroundColour((0,0,0,0))
        
        drawer.DrawMolecule(mol)
        drawer.FinishDrawing()
        return Response(content=drawer.GetDrawingText(), media_type="image/svg+xml")
    except Exception as e:
        logger.error(f"Image generation error: {e}")
        return Response(content=str(e), status_code=400)


# ── Research Paper Summarizer (Intelligence Layer) ──
class PaperSummarizeRequest(BaseModel):
    abstract: str

@router.post("/summarize_paper")
def summarize_paper(request: PaperSummarizeRequest):
    """
    Summarize a biomedical research paper abstract using the LLM Intelligence Layer.
    Returns: title_guess, key_findings, drug_targets, methodology, relevance, keywords.
    """
    if not request.abstract or len(request.abstract.strip()) < 20:
        return {"error": "Please provide a valid abstract or paper text."}
    
    result = llm_bot.summarize_paper(request.abstract)
    return result