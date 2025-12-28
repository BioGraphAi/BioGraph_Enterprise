from fastapi import APIRouter, Response
from pydantic import BaseModel
from typing import Optional, Dict, Any
from modules.report_generator import generate_pdf

router = APIRouter()

class ReportRequest(BaseModel):
    name: str
    smiles: str
    score: float
    target_id: str
    admet: Optional[Dict[str, Any]] = None

@router.post("/download_report")
def download_pdf(report_data: ReportRequest):
    data_dict = report_data.dict()
    pdf_buffer = generate_pdf(data_dict)
    
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=BioGraph_Report_{data_dict['name']}.pdf"}
    )