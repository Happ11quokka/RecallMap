from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any, Optional
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)


class VectorDBService:
    """Pinecone 벡터 DB 서비스"""

    def __init__(self):
        self.settings = get_settings()
        self.pc = Pinecone(api_key=self.settings.pinecone_api_key)
        self.index_name = self.settings.pinecone_index_name
        self.dimension = self.settings.embedding_dimension
        self._ensure_index()

    def _ensure_index(self):
        """인덱스가 없으면 생성"""
        try:
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]

            if self.index_name not in existing_indexes:
                logger.info(f"Creating Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=self.settings.pinecone_environment
                    )
                )
                logger.info(f"Index {self.index_name} created successfully")

            self.index = self.pc.Index(self.index_name)

        except Exception as e:
            logger.error(f"Error ensuring index: {e}")
            raise

    def upsert_document(
        self,
        doc_id: str,
        embedding: List[float],
        metadata: Dict[str, Any]
    ) -> bool:
        """문서 벡터를 Pinecone에 저장"""
        try:
            self.index.upsert(
                vectors=[{
                    "id": doc_id,
                    "values": embedding,
                    "metadata": metadata
                }]
            )
            logger.info(f"Document {doc_id} upserted successfully")
            return True
        except Exception as e:
            logger.error(f"Error upserting document {doc_id}: {e}")
            raise

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 10,
        filter_dict: Optional[Dict[str, Any]] = None,
        namespace: str = ""
    ) -> List[Dict[str, Any]]:
        """벡터 검색"""
        try:
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                filter=filter_dict,
                namespace=namespace,
                include_metadata=True
            )

            return [
                {
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                }
                for match in results.matches
            ]
        except Exception as e:
            logger.error(f"Error searching: {e}")
            raise

    def delete_document(self, doc_id: str) -> bool:
        """문서 삭제"""
        try:
            self.index.delete(ids=[doc_id])
            logger.info(f"Document {doc_id} deleted successfully")
            return True
        except Exception as e:
            logger.error(f"Error deleting document {doc_id}: {e}")
            raise

    def get_stats(self) -> Dict[str, Any]:
        """인덱스 통계"""
        try:
            return self.index.describe_index_stats()
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            raise

    def get_all_documents(
        self,
        project: Optional[str] = None,
        limit: int = 200
    ) -> List[Dict[str, Any]]:
        """모든 문서 조회 (프로젝트 필터 지원)

        Pinecone은 scan API가 없으므로 더미 벡터로 쿼리하여 모든 문서를 가져옵니다.
        """
        try:
            # 더미 벡터로 쿼리 (0 벡터)
            dummy_vector = [0.0] * self.dimension

            # 필터 구성
            filter_dict = None
            if project:
                filter_dict = {"project": {"$eq": project}}

            # 쿼리 실행
            results = self.index.query(
                vector=dummy_vector,
                top_k=limit,
                filter=filter_dict,
                include_metadata=True
            )

            documents = []
            for match in results.matches:
                doc = {
                    "id": match.id,
                    "metadata": match.metadata
                }
                documents.append(doc)

            logger.info(f"Retrieved {len(documents)} documents")
            return documents

        except Exception as e:
            logger.error(f"Error getting all documents: {e}")
            raise

    def query_similar(
        self,
        doc_id: str,
        query_vector: List[float],
        top_k: int = 20,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """특정 문서와 유사한 문서 검색

        Args:
            doc_id: 제외할 문서 ID (자기 자신)
            query_vector: 쿼리 벡터
            top_k: 최대 결과 개수
            filter_dict: 필터 조건

        Returns:
            유사한 문서 리스트 (자기 자신 제외)
        """
        try:
            results = self.index.query(
                vector=query_vector,
                top_k=top_k + 1,  # 자기 자신 포함될 수 있으므로 +1
                filter=filter_dict,
                include_metadata=True
            )

            similar_docs = []
            for match in results.matches:
                # 자기 자신 제외
                if match.id != doc_id:
                    similar_docs.append({
                        "id": match.id,
                        "score": match.score,
                        "metadata": match.metadata
                    })

            return similar_docs[:top_k]

        except Exception as e:
            logger.error(f"Error querying similar documents: {e}")
            raise


# 싱글톤 인스턴스
_vector_db_service = None


def get_vector_db() -> VectorDBService:
    global _vector_db_service
    if _vector_db_service is None:
        _vector_db_service = VectorDBService()
    return _vector_db_service
