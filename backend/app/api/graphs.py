from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import logging
from app.services.graph_service import get_graph_service
from app.schemas.graph import GraphData

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/graphs", tags=["graphs"])


@router.get("/data", response_model=GraphData)
async def get_graph_data(
    project: Optional[str] = Query(None, description="프로젝트 필터 (work, tech, personal 등)"),
    min_similarity: float = Query(0.5, ge=0.0, le=1.0, description="최소 엣지 가중치"),
    top_k: int = Query(50, ge=1, le=200, description="최대 노드 수")
):
    """
    그래프 데이터 반환 (노드 + 엣지)

    - 벡터 유사도 + 메타데이터 기반 하이브리드 연결
    - 프로젝트 필터 지원
    - 메모리 캐싱 (프로젝트 필터 없을 때)
    """
    try:
        service = get_graph_service()
        graph_data = await service.get_graph_data(
            project=project,
            min_similarity=min_similarity,
            top_k=top_k
        )
        return graph_data

    except Exception as e:
        logger.error(f"Error getting graph data: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/nodes/{node_id}")
async def get_node(node_id: str):
    """
    특정 노드 상세 정보 조회

    - Pinecone에서 노드 메타데이터 조회
    """
    try:
        from app.services.vector_db import get_vector_db
        vector_db = get_vector_db()

        # Pinecone fetch로 개별 문서 조회
        result = vector_db.index.fetch(ids=[node_id])

        if not result.vectors or node_id not in result.vectors:
            raise HTTPException(status_code=404, detail="Node not found")

        vector_data = result.vectors[node_id]
        metadata = vector_data.metadata

        return {
            "id": node_id,
            "summary": metadata.get("summary", ""),
            "text": metadata.get("text", ""),
            "format": metadata.get("format", "memo"),
            "context": metadata.get("context", ""),
            "keywords": metadata.get("keywords", []),
            "project": metadata.get("project", ""),
            "created_at": metadata.get("created_at", "")
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting node {node_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/nodes/{node_id}")
async def delete_node(node_id: str):
    """
    노드 삭제

    - Pinecone에서 노드 삭제
    - 그래프 캐시 무효화
    """
    try:
        from app.services.vector_db import get_vector_db
        vector_db = get_vector_db()

        # 노드 삭제
        vector_db.delete_document(node_id)

        # 캐시 무효화
        service = get_graph_service()
        service.invalidate_cache()

        return {"message": f"Node {node_id} deleted successfully"}

    except Exception as e:
        logger.error(f"Error deleting node {node_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/invalidate-cache")
async def invalidate_cache():
    """
    그래프 캐시 무효화

    - 문서 업로드/수정/삭제 후 호출하여 그래프 재계산
    """
    try:
        service = get_graph_service()
        service.invalidate_cache()
        return {"message": "Cache invalidated successfully"}

    except Exception as e:
        logger.error(f"Error invalidating cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))
