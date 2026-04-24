from pydantic import BaseModel, Field
from typing import List, Optional, Any


class UserInput(BaseModel):
    grade: str = Field(..., description="10th or 12th")
    marks: float = Field(..., ge=0, le=100, description="Percentage marks")
    budget: float = Field(..., ge=0, description="Annual budget in INR")
    location: str = Field(..., description="Preferred district/city")
    career_interest: str = Field(..., description="Career interest area")


class College(BaseModel):
    aishe_code: str
    name: str
    district: str
    location_type: str
    program: str
    entrance_exam: str
    quota: str
    closing_rank: Any
    fee: float
    management_fee: float
    avg_package: float
    tier: str
    university: str
    website: str


class PathNode(BaseModel):
    id: int
    title: str
    description: str
    type: str
    colleges: List[College] = []
    cost: str
    eligibility: str
    exams: List[str] = []
    resources: List[str] = []


class PathEdge(BaseModel):
    from_node: int = Field(..., alias="from")
    to_node: int = Field(..., alias="to")

    class Config:
        populate_by_name = True


class AlternativePath(BaseModel):
    label: str
    nodes: List[PathNode]
    edges: List[PathEdge]


class PathResponse(BaseModel):
    nodes: List[PathNode]
    edges: List[dict]
    alternative_paths: List[AlternativePath] = []
    summary: str = ""


class BranchRequest(BaseModel):
    user_input: UserInput
    from_node_id: int
    from_node_title: str
