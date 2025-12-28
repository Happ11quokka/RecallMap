from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.api import documents
from app.core.langsmith import init_langsmith

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# LangSmith 초기화 (선택사항)
init_langsmith()

# FastAPI 앱 생성
app = FastAPI(
    title="RecallMap API",
    description="기억을 연결하고, 맥락으로 다시 찾는 지식 관리 서비스",
    version="1.0.0"
)

# CORS 설정 (프론트엔드와 통신)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 개발 서버
        "http://localhost:3000",  # 추가 개발 서버
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(documents.router)


@app.get("/")
async def root():
    """API 루트"""
    return {
        "message": "RecallMap API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
