from pydantic import BaseModel, Field
from typing import Any


class ExploreInput(BaseModel):
    stream: str = Field(..., description="Science | Commerce | Arts")
    marks: float = Field(..., ge=0, le=100)
    budget: float = Field(..., ge=0, description="Annual budget in INR")
    location: str = Field(default="", description="Preferred location (informational)")


class JsonPathNode(BaseModel):
    id: int
    raw_id: int
    title: str
    description: str
    type: str
    cost: str
    exams: list[str] = []
    colleges: list[str] = []
    career_outcomes: list[str] = []
    marks_required: int = 0
    budget_min: int = 0
    depth: int = 0


class JsonPathEdge(BaseModel):
    from_node: int = Field(..., alias="from")
    to_node: int = Field(..., alias="to")

    class Config:
        populate_by_name = True


class JsonPathResponse(BaseModel):
    nodes: list[JsonPathNode]
    edges: list[dict[str, Any]]
    alternatives: list[JsonPathNode] = []
    summary: str = ""


class BranchInputJson(BaseModel):
    stream: str
    from_node_title: str
    marks: float
    budget: float


class PdfInputJson(BaseModel):
    explore_input: ExploreInput
    selected_node_titles: list[str] = []
