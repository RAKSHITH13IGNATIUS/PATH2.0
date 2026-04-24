from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io
from models.schemas import UserInput, PathResponse, BranchRequest
from services.path_engine import build_path, build_branch_path
from services.pdf_generator import generate_pdf

router = APIRouter()


@router.post("/generate-path", response_model=PathResponse)
async def generate_path(user_input: UserInput):
    try:
        result = build_path(user_input)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/branch-path", response_model=PathResponse)
async def branch_path(req: BranchRequest):
    try:
        result = build_branch_path(req.user_input, req.from_node_id, req.from_node_title)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export-pdf")
async def export_pdf(user_input: UserInput):
    try:
        path = build_path(user_input)
        pdf_bytes = generate_pdf(user_input, path)
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=PATH_Career_Report.pdf"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
