from fastapi import APIRouter, Response
from rdkit.Chem import Draw
from urllib.parse import unquote
from modules.chemistry import get_smiles_from_input
from modules.state import get_progress # ✅ IMPORTED SHARED STATE

router = APIRouter()

@router.get("/")
def read_root():
    return {"status": "online", "message": "BioGraph Engine is Modular & Ready"}

@router.get("/progress")
def fetch_progress(session_id: str = "default_session"):
    # ✅ Ab ye wahi progress dikhayega jo is session ki hogi
    prog = get_progress(session_id)
    if prog["total"] == 0:
        return {"progress": 0, "status": "Idle"}
    
    perc = int((prog["current"] / prog["total"]) * 100)
    return {"progress": perc, "status": prog["status"]}

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