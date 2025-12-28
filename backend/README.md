# RecallMap Backend

RecallMap의 백엔드 API 서버입니다. FastAPI를 기반으로 문서 임베딩, 검색, 재랭킹, 답변 생성 기능을 제공합니다.

## 주요 기능

### 1. 문서 Ingest (파일 → 기억 변환)
- 텍스트 파일 업로드
- 한 줄 요약 자동 생성 (GPT-4)
- 키워드 자동 추출
- 임베딩 생성 (OpenAI text-embedding-3-small)
- Pinecone 벡터 DB 저장

### 2. 검색 (Search)
- 자연어 쿼리로 검색
- 검색 범위 선택:
  - `summary`: 요약만 검색
  - `content`: 원문만 검색
  - `both`: 둘 다 검색
- 프로젝트 필터 지원
- 벡터 유사도 기반 검색

### 3. 재랭킹 (Rerank)
- Cohere Rerank API 사용
- 검색 결과를 쿼리와의 관련성 순으로 재정렬
- Evidence(근거) 자동 추출

### 4. 답변 생성 (Answer Compose)
- 검색 결과를 종합하여 답변 생성
- 핵심 포인트 3가지 추출
- 근거 문서 포함

## 기술 스택

- **FastAPI**: 웹 프레임워크
- **OpenAI API**: 임베딩, 요약, 답변 생성
- **Cohere API**: Rerank
- **Pinecone**: 벡터 데이터베이스
- **Python 3.11+**

## 설치 및 실행

### 1. 가상환경 생성 및 활성화

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 API 키를 입력합니다.

```bash
cp .env.example .env
```

`.env` 파일 내용:
```env
# API Keys
OPENAI_API_KEY=sk-...
COHERE_API_KEY=...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1  # 또는 your region
PINECONE_INDEX_NAME=recallmap

# App Settings
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSION=1536
LLM_MODEL=gpt-4-turbo-preview
RERANK_MODEL=rerank-english-v3.0
```

### 4. 서버 실행

```bash
# 개발 모드 (자동 리로드)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는
python -m app.main
```

서버가 실행되면:
- API: http://localhost:8000
- Swagger 문서: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 엔드포인트

### 문서 업로드

**POST** `/api/documents/upload`
- 파일 업로드 (multipart/form-data)
- Parameters:
  - `file`: .txt 파일
  - `project`: 프로젝트 이름 (예: work, tech, personal)

**POST** `/api/documents/upload-text`
- 텍스트 직접 업로드 (JSON)
```json
{
  "text": "문서 내용...",
  "project": "work",
  "filename": "optional.txt"
}
```

### 검색

**POST** `/api/documents/search`
```json
{
  "query": "검색 쿼리",
  "project": "work",  // optional
  "search_scope": "both",  // summary | content | both
  "top_k": 10,
  "use_rerank": true
}
```

### 답변 생성

**POST** `/api/documents/answer`
```json
{
  "query": "사용자 질문",
  "top_results": [...],  // SearchResultItem 배열
  "max_results_to_use": 3
}
```

### 통계

**GET** `/api/documents/stats`
- Pinecone 인덱스 통계

## 프로젝트 구조

```
backend/
├── app/
│   ├── main.py              # FastAPI 앱
│   ├── core/
│   │   └── config.py        # 설정
│   ├── api/
│   │   └── documents.py     # API 라우터
│   ├── services/
│   │   ├── llm_service.py   # LLM 서비스
│   │   ├── vector_db.py     # Pinecone 서비스
│   │   └── document_service.py  # 문서 관리
│   └── schemas/
│       └── document.py      # Pydantic 스키마
├── requirements.txt
├── .env.example
└── README.md
```

## 데모 시나리오

### 시나리오 1: 문서 업로드
```bash
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@sample.txt" \
  -F "project=tech"
```

### 시나리오 2: 검색 (Rerank ON)
```bash
curl -X POST "http://localhost:8000/api/documents/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "FastAPI 성능 최적화",
    "project": "tech",
    "search_scope": "both",
    "top_k": 5,
    "use_rerank": true
  }'
```

### 시나리오 3: 검색 (Rerank OFF)
```bash
curl -X POST "http://localhost:8000/api/documents/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "FastAPI 성능 최적화",
    "project": "tech",
    "search_scope": "both",
    "top_k": 5,
    "use_rerank": false
  }'
```

## 주요 설정

### Pinecone 인덱스 생성
- 자동으로 생성됩니다.
- Dimension: 1536 (OpenAI text-embedding-3-small)
- Metric: cosine
- Serverless 모드

### LLM 모델
- 요약: gpt-4-turbo-preview
- 임베딩: text-embedding-3-small
- 재랭킹: cohere rerank-english-v3.0

## 문제 해결

### Pinecone 연결 오류
- API 키와 환경(region) 확인
- 인덱스 이름이 중복되지 않는지 확인

### OpenAI API 오류
- API 키 확인
- Rate limit 확인
- 크레딧 잔액 확인

### Cohere API 오류
- API 키 확인
- 무료 플랜의 경우 제한 확인

## 라이선스

MIT
