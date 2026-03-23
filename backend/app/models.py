from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from pydantic import Field


class GraphEdge(BaseModel):
    source_id: str = Field(..., alias="source")
    target_id: str = Field(..., alias="target")
    source_handle: Optional[str] = Field(
        None, alias="sourceHandle"
    )  # w przypadku gdy jest wiecej niz jedno wyjscie z wezla np petla ma koniec i iteracje


class GraphNode(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]


class GraphPayload(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
