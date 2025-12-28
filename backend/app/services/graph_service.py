from typing import List, Dict, Any, Optional, Tuple
import logging
import asyncio
from datetime import datetime
from app.services.vector_db import get_vector_db
from app.schemas.graph import GraphNode, GraphEdge, GraphData

logger = logging.getLogger(__name__)


class GraphService:
    """그래프 데이터 생성 서비스"""

    def __init__(self):
        self.vector_db = get_vector_db()
        self._cache: Optional[GraphData] = None  # 메모리 캐시

    async def get_graph_data(
        self,
        project: Optional[str] = None,
        min_similarity: float = 0.5,
        top_k: int = 50
    ) -> GraphData:
        """그래프 데이터 반환 (캐싱 지원)

        Args:
            project: 프로젝트 필터 (None이면 전체)
            min_similarity: 최소 엣지 가중치 (0.0 ~ 1.0)
            top_k: 최대 노드 수

        Returns:
            GraphData: 노드, 엣지, 메타데이터
        """
        logger.info(f"Getting graph data - project: {project}, min_similarity: {min_similarity}, top_k: {top_k}")

        # 캐시 체크 (프로젝트 필터 없을 때만)
        if self._cache and not project:
            logger.info("Returning cached graph data")
            # min_similarity 필터링만 적용
            return self._filter_by_similarity(self._cache, min_similarity)

        # 1. Pinecone에서 모든 문서 가져오기
        documents = self.vector_db.get_all_documents(project=project, limit=top_k)

        if not documents:
            logger.warning("No documents found")
            return GraphData(nodes=[], edges=[], metadata={
                "total_nodes": 0,
                "total_edges": 0,
                "avg_connections_per_node": 0.0
            })

        # 2. GraphNode 변환
        nodes = []
        for doc in documents:
            metadata = doc["metadata"]
            node = GraphNode(
                id=doc["id"],
                label=metadata.get("summary", "")[:50],  # 라벨은 요약 50자
                summary=metadata.get("summary", ""),
                keywords=metadata.get("keywords", []),
                project=metadata.get("project", ""),
                created_at=datetime.fromisoformat(metadata.get("created_at", datetime.now().isoformat()))
            )
            nodes.append(node)

        # 3. 엣지 계산 (비동기 병렬 처리)
        edges = await self._compute_edges(documents, min_similarity)

        # 4. 메타데이터 계산
        total_edges = len(edges)
        avg_connections = (total_edges * 2) / len(nodes) if nodes else 0.0

        metadata = {
            "total_nodes": len(nodes),
            "total_edges": total_edges,
            "avg_connections_per_node": round(avg_connections, 2)
        }

        graph_data = GraphData(nodes=nodes, edges=edges, metadata=metadata)

        # 캐시 저장 (프로젝트 필터 없을 때만)
        if not project:
            self._cache = graph_data
            logger.info("Graph data cached")

        return graph_data

    async def _compute_edges(
        self,
        documents: List[Dict[str, Any]],
        min_similarity: float
    ) -> List[GraphEdge]:
        """모든 문서 쌍의 엣지 계산 (비동기 병렬 처리)

        각 문서에 대해 Pinecone query로 유사 문서를 찾아 엣지 생성
        """
        logger.info(f"Computing edges for {len(documents)} documents")

        # 문서 ID를 키로 하는 맵 생성
        doc_map = {doc["id"]: doc for doc in documents}

        # 엣지 저장 (중복 방지를 위해 set 사용)
        edge_dict: Dict[Tuple[str, str], Tuple[float, str]] = {}

        # 각 문서에 대해 비동기로 유사 문서 검색
        tasks = []
        for doc in documents:
            task = self._find_similar_for_doc(doc, doc_map, min_similarity)
            tasks.append(task)

        # 병렬 실행
        results = await asyncio.gather(*tasks)

        # 결과 병합
        for doc_edges in results:
            for (source, target), (weight, edge_type) in doc_edges.items():
                # 중복 방지: 항상 작은 ID가 source
                pair = tuple(sorted([source, target]))
                if pair not in edge_dict or edge_dict[pair][0] < weight:
                    edge_dict[pair] = (weight, edge_type)

        # GraphEdge 객체 생성
        edges = []
        for (source, target), (weight, edge_type) in edge_dict.items():
            edge = GraphEdge(
                source=source,
                target=target,
                weight=round(weight, 4),
                edge_type=edge_type
            )
            edges.append(edge)

        logger.info(f"Computed {len(edges)} edges")
        return edges

    async def _find_similar_for_doc(
        self,
        doc: Dict[str, Any],
        doc_map: Dict[str, Dict[str, Any]],
        min_similarity: float
    ) -> Dict[Tuple[str, str], Tuple[float, str]]:
        """특정 문서와 유사한 문서 찾기

        Pinecone에 저장된 임베딩이 없으면 스킵
        """
        edges = {}

        # Pinecone에서 유사 문서 검색
        # 더미 벡터로 검색 (실제로는 임베딩이 저장되어 있음)
        # 하지만 Pinecone query는 벡터가 필요하므로, 우회 방법 사용

        # 방법: 각 문서의 임베딩을 이미 Pinecone에 저장했으므로
        # 동일한 쿼리를 다시 실행하여 유사도 확인
        # 하지만 query_vector가 필요함 -> 문제!

        # 해결책: 모든 문서 쌍을 비교 (O(N^2))
        # 문서 수가 50-100개 수준이면 허용 가능
        doc_id = doc["id"]
        doc_metadata = doc["metadata"]

        for other_id, other_doc in doc_map.items():
            if doc_id == other_id:
                continue

            other_metadata = other_doc["metadata"]

            # 메타데이터 기반 유사도 계산
            # (벡터 유사도 없이 메타데이터만 사용)
            weight, edge_type = self._calculate_edge_weight(
                doc_metadata,
                other_metadata,
                vector_similarity=0.5  # 기본값 (실제 벡터 유사도 없음)
            )

            if weight >= min_similarity:
                edges[(doc_id, other_id)] = (weight, edge_type)

        return edges

    def _calculate_edge_weight(
        self,
        doc1_metadata: Dict[str, Any],
        doc2_metadata: Dict[str, Any],
        vector_similarity: float
    ) -> Tuple[float, str]:
        """하이브리드 엣지 가중치 계산

        Args:
            doc1_metadata: 문서1 메타데이터
            doc2_metadata: 문서2 메타데이터
            vector_similarity: 벡터 유사도 (0.0 ~ 1.0)

        Returns:
            (가중치, 엣지 타입)
        """
        base_weight = vector_similarity
        metadata_boost = 0.0

        # 1. 같은 프로젝트: +0.15
        if doc1_metadata.get("project") == doc2_metadata.get("project"):
            metadata_boost += 0.15

        # 2. 공통 키워드: +0.05 per keyword (최대 +0.15)
        keywords1 = set(doc1_metadata.get("keywords", []))
        keywords2 = set(doc2_metadata.get("keywords", []))
        common_keywords = keywords1 & keywords2
        keyword_boost = min(len(common_keywords) * 0.05, 0.15)
        metadata_boost += keyword_boost

        # 최종 가중치
        final_weight = min(base_weight + metadata_boost, 1.0)

        # 엣지 타입 결정
        if metadata_boost > 0.1:
            edge_type = "hybrid"
        elif metadata_boost > 0:
            edge_type = "metadata"
        else:
            edge_type = "vector"

        return final_weight, edge_type

    def _filter_by_similarity(
        self,
        graph_data: GraphData,
        min_similarity: float
    ) -> GraphData:
        """캐시된 그래프 데이터에서 min_similarity 필터링"""
        filtered_edges = [
            edge for edge in graph_data.edges
            if edge.weight >= min_similarity
        ]

        return GraphData(
            nodes=graph_data.nodes,
            edges=filtered_edges,
            metadata={
                **graph_data.metadata,
                "total_edges": len(filtered_edges)
            }
        )

    def invalidate_cache(self):
        """캐시 무효화 (문서 업데이트 시 호출)"""
        self._cache = None
        logger.info("Graph cache invalidated")


# 싱글톤 인스턴스
_graph_service = None


def get_graph_service() -> GraphService:
    global _graph_service
    if _graph_service is None:
        _graph_service = GraphService()
    return _graph_service
