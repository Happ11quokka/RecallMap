from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import logging
from app.schemas.document import (
    DocumentUploadRequest,
    DocumentIngestResponse,
    SearchRequest,
    SearchResponse,
    AnswerRequest,
    AnswerResponse
)
from app.services.document_service import get_document_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentIngestResponse)
async def upload_document(
    file: UploadFile = File(...),
    project: str = Form(...),
):
    """
    파일을 업로드하고 기억으로 변환

    - txt 파일만 지원
    - 요약, 키워드 자동 생성
    - Pinecone에 임베딩 저장
    """
    try:
        # 파일 확장자 검증
        if not file.filename.endswith('.txt'):
            raise HTTPException(status_code=400, detail="Only .txt files are supported")

        # 파일 읽기
        content = await file.read()
        text = content.decode('utf-8')

        if not text.strip():
            raise HTTPException(status_code=400, detail="File is empty")

        # DocumentService 호출
        service = get_document_service()
        request = DocumentUploadRequest(
            text=text,
            project=project,
            filename=file.filename
        )

        result = await service.ingest_document(request)
        return result

    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid UTF-8 encoding")
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-text", response_model=DocumentIngestResponse)
async def upload_text(request: DocumentUploadRequest):
    """
    텍스트를 직접 업로드하고 기억으로 변환

    - 프론트엔드에서 textarea로 입력한 텍스트 처리
    - 파일 없이 텍스트만으로 문서 생성
    """
    try:
        service = get_document_service()
        result = await service.ingest_document(request)
        return result

    except Exception as e:
        logger.error(f"Error uploading text: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search", response_model=SearchResponse)
async def search_documents(request: SearchRequest):
    """
    문서 검색

    - 자연어 쿼리로 검색
    - 요약/원문/둘 다 검색 가능
    - 프로젝트 필터 지원
    - 선택적 rerank 적용
    """
    try:
        service = get_document_service()
        result = await service.search_documents(request)
        return result

    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/answer", response_model=AnswerResponse)
async def compose_answer(request: AnswerRequest):
    """
    검색 결과 기반 답변 생성

    - 검색 결과를 종합하여 답변 생성
    - 핵심 포인트 3개 추출
    - 근거 문서 포함
    """
    try:
        service = get_document_service()
        result = await service.compose_answer(request)
        return result

    except Exception as e:
        logger.error(f"Error composing answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_stats():
    """
    벡터 DB 통계
    """
    try:
        from app.services.vector_db import get_vector_db
        vector_db = get_vector_db()
        stats = vector_db.get_stats()

        # Pinecone stats 객체에서 필요한 정보만 추출 (primitive types만 사용)
        total_count = 0
        if hasattr(stats, 'total_vector_count'):
            total_count = int(stats.total_vector_count)

        dimension = 0
        if hasattr(stats, 'dimension'):
            dimension = int(stats.dimension)

        # namespaces는 복잡한 객체이므로 단순 카운트만 반환
        namespace_count = 0
        if hasattr(stats, 'namespaces') and stats.namespaces:
            namespace_count = len(stats.namespaces)

        return {
            "total_vector_count": total_count,
            "dimension": dimension,
            "namespace_count": namespace_count,
        }

    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
