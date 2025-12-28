# RecallMap 아키텍처

## 전체 구조

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│             │          │             │          │             │
│  Frontend   │  HTTP    │   Backend   │  API     │  External   │
│   (React)   ├─────────▶│  (FastAPI)  ├─────────▶│  Services   │
│             │          │             │          │             │
└─────────────┘          └──────┬──────┘          └─────────────┘
                                │                        │
                                │                  ┌─────┴──────┐
                                │                  │            │
                         ┌──────┴──────┐          │  Pinecone  │
                         │             │          │  (Vector)  │
                         │ LLM Service │          │            │
                         │             │          │  OpenAI    │
                         └─────────────┘          │  (LLM)     │
                                                   │            │
                                                   │  Cohere    │
                                                   │  (Rerank)  │
                                                   │            │
                                                   └────────────┘
```

## 컴포넌트 상세

### 1. Frontend (React + TypeScript)

**역할:**
- 사용자 인터페이스 제공
- 파일 업로드 UI
- 검색 UI
- 결과 표시

**주요 파일:**
- `src/api/backend.ts`: 백엔드 API 클라이언트
- `src/components/UploadForm.tsx`: 업로드 폼
- `src/components/AgentChat.tsx`: 검색 UI

**기술:**
- React 18 + TypeScript
- TanStack Query (서버 상태 관리)
- Tailwind CSS (스타일링)

### 2. Backend (FastAPI)

**역할:**
- RESTful API 제공
- 문서 처리 로직
- LLM 서비스 오케스트레이션
- 벡터 DB 관리

**주요 엔드포인트:**
```
POST /api/documents/upload          - 파일 업로드
POST /api/documents/upload-text     - 텍스트 업로드
POST /api/documents/search          - 검색
POST /api/documents/answer          - 답변 생성
GET  /api/documents/stats           - 통계
```

**서비스 레이어:**

#### a. Document Service (`document_service.py`)
문서 처리의 전체 흐름을 관리:
1. Ingest: 문서 → 요약 → 키워드 → 임베딩 → 저장
2. Search: 쿼리 → 임베딩 → 벡터 검색 → (Rerank) → 결과
3. Answer: 검색 결과 → LLM → 답변 + 하이라이트

#### b. LLM Service (`llm_service.py`)
LLM 관련 모든 작업:
- `generate_embedding()`: 텍스트 → 벡터 (OpenAI)
- `generate_summary()`: 문서 → 한 줄 요약 (GPT-4)
- `extract_keywords()`: 문서 → 키워드 리스트 (GPT-4)
- `rerank_results()`: 검색 결과 재정렬 (Cohere)
- `compose_answer()`: 검색 결과 → 답변 (GPT-4)

#### c. Vector DB Service (`vector_db.py`)
Pinecone 벡터 DB 관리:
- `upsert_document()`: 문서 벡터 저장
- `search()`: 벡터 유사도 검색
- `delete_document()`: 문서 삭제
- `get_stats()`: 통계 조회

### 3. External Services

#### a. OpenAI API
- **Embedding**: `text-embedding-3-small` (1536 차원)
- **LLM**: `gpt-4-turbo-preview`
- 용도: 임베딩 생성, 요약, 키워드 추출, 답변 생성

#### b. Cohere API
- **Rerank**: `rerank-english-v3.0`
- 용도: 검색 결과 재정렬, 관련성 점수 계산

#### c. Pinecone
- **벡터 DB**: Serverless (AWS)
- **Dimension**: 1536
- **Metric**: Cosine similarity
- 용도: 문서 임베딩 저장 및 검색

## 데이터 흐름

### 1. Document Ingest Flow

```
User uploads file (.txt)
    │
    ▼
Frontend sends to POST /api/documents/upload
    │
    ▼
Backend reads file content
    │
    ▼
LLM Service:
  ├─ generate_summary() → 한 줄 요약
  ├─ extract_keywords() → 키워드 리스트
  └─ generate_embedding() → 벡터 [1536]
    │
    ▼
Vector DB Service:
  └─ upsert_document(id, vector, metadata)
    │
    ▼
Return DocumentIngestResponse to Frontend
```

### 2. Search Flow (without Rerank)

```
User inputs query
    │
    ▼
Frontend sends to POST /api/documents/search
    │
    ▼
LLM Service:
  └─ generate_embedding(query) → query_vector
    │
    ▼
Vector DB Service:
  └─ search(query_vector, top_k=10) → results
    │
    ▼
Filter by search_scope (summary/content/both)
    │
    ▼
Return SearchResponse to Frontend
```

### 3. Search Flow (with Rerank)

```
User inputs query + use_rerank=True
    │
    ▼
Frontend sends to POST /api/documents/search
    │
    ▼
LLM Service:
  └─ generate_embedding(query) → query_vector
    │
    ▼
Vector DB Service:
  └─ search(query_vector, top_k=20) → raw_results
    │
    ▼
LLM Service:
  └─ rerank_results(query, raw_results) → reranked_results
       │
       ├─ Cohere Rerank API
       └─ Add evidence to each result
    │
    ▼
Return top_k reranked results to Frontend
```

### 4. Answer Composition Flow

```
User clicks "답변 생성"
    │
    ▼
Frontend sends to POST /api/documents/answer
  with search_results
    │
    ▼
LLM Service:
  └─ compose_answer(query, results)
       │
       ├─ Construct context from top 3 documents
       ├─ GPT-4 generates answer (2-6 sentences)
       └─ Extract highlights (3 points)
    │
    ▼
Return AnswerResponse to Frontend
```

## 데이터 모델

### Pinecone Metadata Structure

```json
{
  "doc_id": "uuid-string",
  "summary": "한 줄 요약",
  "preview": "미리보기 텍스트 (200자)",
  "keywords": ["키워드1", "키워드2", ...],
  "project": "work|tech|personal",
  "filename": "example.txt",
  "full_text": "전체 원문",
  "created_at": "2024-01-01T00:00:00"
}
```

### API Request/Response 스키마

모든 스키마는 `backend/app/schemas/document.py`에 정의:
- `DocumentUploadRequest`
- `DocumentIngestResponse`
- `SearchRequest`
- `SearchResponse`
- `SearchResultItem`
- `AnswerRequest`
- `AnswerResponse`

## 주요 알고리즘

### 1. Embedding Generation

```python
text = summary + "\n" + full_text[:1000]
embedding = openai.embeddings.create(
    model="text-embedding-3-small",
    input=text
)
# Returns: 1536-dimensional vector
```

### 2. Vector Search

```python
results = pinecone_index.query(
    vector=query_embedding,
    top_k=10,
    filter={"project": "tech"},  # optional
    include_metadata=True
)
# Returns: List of (id, score, metadata)
```

### 3. Reranking

```python
doc_texts = [f"{r['summary']}\n{r['preview']}" for r in results]

rerank_response = cohere.rerank(
    model="rerank-english-v3.0",
    query=query,
    documents=doc_texts,
    top_n=5
)
# Returns: Reordered results with relevance scores
```

## 확장 가능성

### 1. 현재 지원
- txt 파일만
- 단일 언어 (한국어/영어 혼용)
- 텍스트 기반 검색

### 2. 향후 확장 가능
- PDF, DOCX 지원 (파일 파싱 추가)
- 이미지, 오디오 (멀티모달 임베딩)
- 청킹 전략 (긴 문서 처리)
- 하이브리드 검색 (키워드 + 벡터)
- 사용자 인증 및 권한 관리
- 문서 버전 관리

## 성능 고려사항

### 병목 지점
1. **LLM API 호출**: 요약/키워드 추출 (1-3초)
2. **Embedding 생성**: 문서당 ~0.5초
3. **Rerank**: 10개 문서 기준 ~1초

### 최적화 방안
- 비동기 처리 (FastAPI async/await)
- 캐싱 (Redis)
- 배치 임베딩
- Connection pooling

## 보안

### 현재 구현
- CORS 설정 (프론트엔드만 허용)
- API 키 환경 변수 관리

### 향후 필요
- JWT 인증
- Rate limiting
- Input validation 강화
- API 키 로테이션

## 모니터링

### 로그
- FastAPI 자동 로깅
- Custom logger (각 서비스)

### 메트릭 (향후)
- API 응답 시간
- 검색 정확도
- LLM 토큰 사용량
- 벡터 DB 사용량

## 배포

### 개발 환경
- Frontend: Vite dev server (port 5173)
- Backend: Uvicorn (port 8000)

### 프로덕션 (향후)
- Frontend: Vercel / Netlify
- Backend: Docker + AWS ECS / Google Cloud Run
- Pinecone: Serverless (이미 프로덕션 ready)
