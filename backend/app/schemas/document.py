from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class DocumentUploadRequest(BaseModel):
    """파일 업로드 요청"""
    text: str = Field(..., description="문서 원문")
    project: str = Field(..., description="프로젝트 이름 (work/tech/personal 등)")
    filename: Optional[str] = Field(None, description="파일명")


class DocumentIngestResponse(BaseModel):
    """파일 ingest 응답"""
    id: str = Field(..., description="문서 고유 ID")
    summary: str = Field(..., description="한 줄 요약")
    keywords: List[str] = Field(..., description="추출된 키워드")
    preview: str = Field(..., description="미리보기 텍스트")
    project: str = Field(..., description="프로젝트 이름")
    created_at: datetime = Field(..., description="생성 시각")
    embedding_stored: bool = Field(..., description="벡터 DB 저장 여부")


class SearchRequest(BaseModel):
    """검색 요청"""
    query: str = Field(..., description="검색 쿼리")
    project: Optional[str] = Field(None, description="프로젝트 필터")
    search_scope: str = Field("both", description="검색 범위: summary/content/both")
    top_k: int = Field(10, ge=1, le=50, description="상위 결과 개수")
    use_rerank: bool = Field(True, description="재랭킹 사용 여부")


class SearchResultItem(BaseModel):
    """검색 결과 아이템"""
    id: str
    score: float
    summary: str
    preview: str
    keywords: List[str]
    project: str
    filename: Optional[str]
    evidence: Optional[str] = Field(None, description="관련성 근거 (rerank 시)")
    created_at: datetime


class SearchResponse(BaseModel):
    """검색 응답"""
    query: str
    results: List[SearchResultItem]
    reranked: bool = Field(False, description="재랭킹 적용 여부")
    total_found: int


class AnswerRequest(BaseModel):
    """답변 생성 요청"""
    query: str = Field(..., description="사용자 질문")
    top_results: List[SearchResultItem] = Field(..., description="검색 결과")
    max_results_to_use: int = Field(3, ge=1, le=10, description="답변에 사용할 결과 개수")


class AnswerResponse(BaseModel):
    """답변 생성 응답"""
    answer: str = Field(..., description="생성된 답변 (2-6문장)")
    highlights: List[str] = Field(..., description="핵심 포인트 3개")
    source_documents: List[SearchResultItem] = Field(..., description="근거 문서")
