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


# 싱글톤 인스턴스
_vector_db_service = None


def get_vector_db() -> VectorDBService:
    global _vector_db_service
    if _vector_db_service is None:
        _vector_db_service = VectorDBService()
    return _vector_db_service
