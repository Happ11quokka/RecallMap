from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
import logging
from app.services.llm_service import get_llm_service
from app.services.vector_db import get_vector_db
from app.schemas.document import (
    DocumentUploadRequest,
    DocumentIngestResponse,
    SearchRequest,
    SearchResponse,
    SearchResultItem,
    AnswerRequest,
    AnswerResponse
)

logger = logging.getLogger(__name__)


class DocumentService:
    """문서 관리 서비스"""

    def __init__(self):
        self.llm_service = get_llm_service()
        self.vector_db = get_vector_db()

    async def ingest_document(self, request: DocumentUploadRequest) -> DocumentIngestResponse:
        """파일을 기억으로 변환하여 저장"""
        try:
            doc_id = str(uuid.uuid4())
            text = request.text

            # 1. 한 줄 요약 생성
            logger.info(f"Generating summary for doc {doc_id}")
            summary = self.llm_service.generate_summary(text)

            # 2. 키워드 추출
            logger.info(f"Extracting keywords for doc {doc_id}")
            keywords = self.llm_service.extract_keywords(text)

            # 3. 미리보기 생성 (첫 200자)
            preview = text[:200] + "..." if len(text) > 200 else text

            # 4. 임베딩 생성 (요약 + 원문 일부)
            logger.info(f"Generating embedding for doc {doc_id}")
            embedding_text = f"{summary}\n{text[:1000]}"
            embedding = self.llm_service.generate_embedding(embedding_text)

            # 5. 메타데이터 구성
            created_at = datetime.utcnow()
            metadata = {
                "doc_id": doc_id,
                "summary": summary,
                "preview": preview,
                "keywords": keywords,
                "project": request.project,
                "filename": request.filename or "untitled.txt",
                "full_text": text,  # 전체 원문 저장
                "created_at": created_at.isoformat()
            }

            # 6. Pinecone에 저장
            logger.info(f"Storing doc {doc_id} to Pinecone")
            self.vector_db.upsert_document(
                doc_id=doc_id,
                embedding=embedding,
                metadata=metadata
            )

            return DocumentIngestResponse(
                id=doc_id,
                summary=summary,
                keywords=keywords,
                preview=preview,
                project=request.project,
                created_at=created_at,
                embedding_stored=True
            )

        except Exception as e:
            logger.error(f"Error ingesting document: {e}")
            raise

    async def search_documents(self, request: SearchRequest) -> SearchResponse:
        """문서 검색 (벡터 검색 + 선택적 rerank)"""
        try:
            # 1. 쿼리 임베딩 생성
            logger.info(f"Searching for: {request.query}")
            query_embedding = self.llm_service.generate_embedding(request.query)

            # 2. 프로젝트 필터 구성
            filter_dict = None
            if request.project:
                filter_dict = {"project": {"$eq": request.project}}

            # 3. Pinecone 검색 (top_k * 2 정도로 더 많이 가져옴)
            search_k = request.top_k * 2 if request.use_rerank else request.top_k
            raw_results = self.vector_db.search(
                query_embedding=query_embedding,
                top_k=search_k,
                filter_dict=filter_dict
            )

            # 4. 검색 범위에 따른 필터링
            filtered_results = self._filter_by_scope(
                raw_results,
                request.query,
                request.search_scope
            )

            # 5. SearchResultItem으로 변환
            result_items = []
            for result in filtered_results[:request.top_k * 2]:  # 여유있게
                metadata = result["metadata"]
                result_items.append({
                    "id": metadata["doc_id"],
                    "score": result["score"],
                    "summary": metadata["summary"],
                    "preview": metadata["preview"],
                    "keywords": metadata.get("keywords", []),
                    "project": metadata["project"],
                    "filename": metadata.get("filename"),
                    "created_at": metadata["created_at"]
                })

            # 6. Rerank (옵션)
            reranked = False
            if request.use_rerank and len(result_items) > 0:
                logger.info("Applying rerank")
                result_items = self.llm_service.rerank_results(
                    query=request.query,
                    documents=result_items,
                    top_k=request.top_k
                )
                reranked = True
            else:
                result_items = result_items[:request.top_k]

            # 7. SearchResultItem 객체로 변환
            final_results = [
                SearchResultItem(**item)
                for item in result_items
            ]

            return SearchResponse(
                query=request.query,
                results=final_results,
                reranked=reranked,
                total_found=len(filtered_results)
            )

        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            raise

    def _filter_by_scope(
        self,
        results: List[Dict[str, Any]],
        query: str,
        scope: str
    ) -> List[Dict[str, Any]]:
        """검색 범위에 따른 필터링"""
        if scope == "both":
            return results

        query_lower = query.lower()

        filtered = []
        for result in results:
            metadata = result["metadata"]

            if scope == "summary":
                # 요약에만 쿼리 단어가 있는지
                summary = metadata.get("summary", "").lower()
                if any(word in summary for word in query_lower.split()):
                    filtered.append(result)

            elif scope == "content":
                # 원문에만 쿼리 단어가 있는지
                full_text = metadata.get("full_text", "").lower()
                if any(word in full_text for word in query_lower.split()):
                    filtered.append(result)

        return filtered if filtered else results  # 필터링 결과 없으면 원본 반환

    async def compose_answer(self, request: AnswerRequest) -> AnswerResponse:
        """검색 결과 기반 답변 생성"""
        try:
            # SearchResultItem을 dict로 변환
            source_docs = [
                item.model_dump() if hasattr(item, 'model_dump') else item
                for item in request.top_results
            ]

            result = self.llm_service.compose_answer(
                query=request.query,
                source_documents=source_docs,
                max_docs=request.max_results_to_use
            )

            # source_documents를 SearchResultItem으로 변환
            source_items = [
                SearchResultItem(**doc) if isinstance(doc, dict) else doc
                for doc in result["source_documents"]
            ]

            return AnswerResponse(
                answer=result["answer"],
                highlights=result["highlights"],
                source_documents=source_items
            )

        except Exception as e:
            logger.error(f"Error composing answer: {e}")
            raise


# 싱글톤 인스턴스
_document_service = None


def get_document_service() -> DocumentService:
    global _document_service
    if _document_service is None:
        _document_service = DocumentService()
    return _document_service
