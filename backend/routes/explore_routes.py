from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from models.json_schemas import ExploreInput, JsonPathResponse, BranchInputJson, PdfInputJson
from services.json_path_engine import build_json_path, build_branch
from services.json_pdf import generate_json_pdf
from services.tree_loader import get_stream_names, get_substreams

router = APIRouter()


@router.get("/streams")
async def list_streams():
    """Return available top-level streams from the JSON tree."""
    return {"streams": get_stream_names()}


@router.post("/generate-path-json", response_model=JsonPathResponse)
async def generate_path_json(inp: ExploreInput):
    try:
        return build_json_path(inp)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/branch-json", response_model=JsonPathResponse)
async def branch_json(req: BranchInputJson):
    try:
        return build_branch(req.stream, req.from_node_title, req.marks, req.budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export-pdf-json")
async def export_pdf_json(req: PdfInputJson):
    try:
        path_data = build_json_path(req.explore_input)
        pdf_bytes = generate_json_pdf(req.explore_input, path_data, req.selected_node_titles)
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=PATH_Career_Report.pdf"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
