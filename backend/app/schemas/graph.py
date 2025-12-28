from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class GraphNode(BaseModel):
    """그래프 노드 (문서)"""
    id: str
    label: str          # summary (짧은 라벨용)
    summary: str        # 전체 요약
    keywords: List[str]
    project: str
    created_at: datetime


class GraphEdge(BaseModel):
    """그래프 엣지 (문서 간 연결)"""
    source: str
    target: str
    weight: float       # 0.0 ~ 1.0
    edge_type: str      # "vector" | "metadata" | "hybrid"


class GraphData(BaseModel):
    """그래프 전체 데이터"""
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    metadata: Dict[str, Any]  # 통계 정보
