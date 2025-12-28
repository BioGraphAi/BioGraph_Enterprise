from fastapi import APIRouter, Response
from rdkit.Chem import Draw
from urllib.parse import unquote
from modules.chemistry import get_smiles_from_input
from modules.state import SCAN_PROGRESS # ✅ IMPORTED SHARED STATE

router = APIRouter()

@router.get("/")
def read_root():
    return {"status": "online", "message": "BioGraph Engine is Modular & Ready"}

@router.get("/progress")
def get_progress():
    # ✅ Ab ye wahi progress dikhayega jo analysis.py update karega
    if SCAN_PROGRESS["total"] == 0:
        return {"progress": 0, "status": "Idle"}
    
    perc = int((SCAN_PROGRESS["current"] / SCAN_PROGRESS["total"]) * 100)
    return {"progress": perc, "status": SCAN_PROGRESS["status"]}

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