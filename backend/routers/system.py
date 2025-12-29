from fastapi import APIRouter, Response, HTTPException
from rdkit.Chem import Draw
from urllib.parse import unquote
from modules.chemistry import get_smiles_from_input
from modules.task_manager import get_task_status

router = APIRouter()

# REMOVED the conflicting root endpoint because it is already defined in main.py
# @router.get("/")
# def read_root():
#     return {"status": "online", "message": "BioGraph Engine is Modular & Ready"}

@router.get("/progress/{task_id}")
def get_progress(task_id: str):
    """
    Fetches the progress of a specific task.
    """
    status = get_task_status(task_id)
    if "error" in status and status["error"] == "Task not found":
         raise HTTPException(status_code=404, detail="Task not found")
    
    return status

@router.get("/molecule_image")
def get_molecule_image(smiles: str):
    try:
        decoded_smiles = unquote(smiles).strip()
        real_smiles, mol = get_smiles_from_input(decoded_smiles)
        
        if not mol: return Response(content="Invalid SMILES", status_code=400)
        
        drawer = Draw.MolDraw2DSVG(400, 400)
        opts = drawer.drawOptions()
        opts.setBackgroundColour((0,0,0,0))
        drawer.DrawMolecule(mol)
        drawer.FinishDrawing()
        return Response(content=drawer.GetDrawingText(), media_type="image/svg+xml")
    except Exception as e:
        return Response(content=str(e), status_code=400)
