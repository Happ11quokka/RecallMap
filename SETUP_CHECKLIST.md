# RecallMap 실행 전 체크리스트

실제로 프론트엔드와 백엔드를 연동하여 테스트하기 전에 아래 항목들을 확인하세요.

## ✅ 백엔드 설정

### 1. API 키 확보

다음 API 키들이 필요합니다:

- **OpenAI API Key**
  - 발급: https://platform.openai.com/api-keys
  - 용도: 임베딩 생성, 요약, 키워드 추출, 답변 생성
  - 모델: `text-embedding-3-small`, `gpt-4-turbo-preview`
  - 비용: 임베딩 ~$0.0001/1K tokens, GPT-4 ~$0.01/1K tokens

- **Cohere API Key**
  - 발급: https://dashboard.cohere.ai/api-keys
  - 용도: Rerank (검색 결과 재정렬)
  - 모델: `rerank-english-v3.0`
  - 비용: 무료 티어 가능 (월 1000 rerank까지)

- **Pinecone API Key**
  - 발급: https://app.pinecone.io/
  - 용도: 벡터 데이터베이스
  - 플랜: Serverless (무료 티어 가능)
  - Region: 예) `us-east-1`

### 2. 백엔드 환경 변수 설정

```bash
cd backend
cp .env.example .env
```

`.env` 파일을 다음과 같이 수정:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-...여기에_실제_키_입력

# Cohere
COHERE_API_KEY=여기에_실제_키_입력

# Pinecone
PINECONE_API_KEY=여기에_실제_키_입력
PINECONE_ENVIRONMENT=us-east-1  # 또는 선택한 region
PINECONE_INDEX_NAME=recallmap

# 모델 설정 (기본값 그대로 사용 가능)
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSION=1536
LLM_MODEL=gpt-4-turbo-preview
RERANK_MODEL=rerank-english-v3.0
```

### 3. 백엔드 설치 및 실행

```bash
cd backend

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**확인:**
- http://localhost:8000 접속 → `{"message": "RecallMap API", ...}` 응답
- http://localhost:8000/docs 접속 → Swagger UI 확인
- http://localhost:8000/health 접속 → `{"status": "healthy"}` 응답

## ✅ 프론트엔드 설정

### 1. 프론트엔드 환경 변수 설정

```bash
cd frontend
cp .env.example .env
```

`.env` 파일 내용 확인:

```env
VITE_API_URL=http://localhost:8000
```

### 2. 프론트엔드 설치 및 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**확인:**
- http://localhost:5173 접속 → 프론트엔드 로드 확인

## ✅ 연동 테스트

### 1. CORS 확인

백엔드 [app/main.py](backend/app/main.py#L23-L30)에서 CORS 설정 확인:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # ← 프론트엔드 주소 포함 확인
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. 컴포넌트 교체

기존 mock 컴포넌트를 백엔드 연동 컴포넌트로 교체:

**UploadForm 교체:**
```tsx
// 기존
import UploadForm from '@/components/UploadForm';

// 변경
import UploadFormBackend from '@/components/UploadFormBackend';

// 사용
<UploadFormBackend onSuccess={() => console.log('업로드 성공')} />
```

**검색 기능 추가:**
```tsx
import SearchPanel from '@/components/SearchPanel';

<SearchPanel />
```

### 3. 간단한 테스트

터미널에서 API 테스트:

```bash
# 헬스 체크
curl http://localhost:8000/health

# 텍스트 업로드 테스트
curl -X POST http://localhost:8000/api/documents/upload-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "테스트 문서입니다. FastAPI는 빠른 Python 웹 프레임워크입니다.",
    "project": "tech",
    "filename": "test.txt"
  }'

# 검색 테스트
curl -X POST http://localhost:8000/api/documents/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "FastAPI",
    "search_scope": "both",
    "top_k": 5,
    "use_rerank": true
  }'
```

### 4. Python 테스트 스크립트 실행

```bash
# 프로젝트 루트에서
python test_api.py
```

이 스크립트는:
1. 샘플 파일 5개 업로드
2. 다양한 검색 시나리오 실행
3. Rerank ON/OFF 비교
4. 답변 생성 테스트

## ✅ 문제 해결

### 문제 1: "Connection refused" 에러
- **원인**: 백엔드가 실행되지 않음
- **해결**: `uvicorn app.main:app --reload` 실행 확인

### 문제 2: "CORS policy" 에러
- **원인**: CORS 설정 문제
- **해결**:
  - 백엔드 `app/main.py`에서 프론트엔드 URL 확인
  - 브라우저 캐시 삭제 후 재시도

### 문제 3: "Pinecone connection error"
- **원인**: Pinecone API 키 또는 region 오류
- **해결**:
  - `.env` 파일에서 `PINECONE_API_KEY` 확인
  - `PINECONE_ENVIRONMENT`가 실제 region과 일치하는지 확인

### 문제 4: "OpenAI API error"
- **원인**: API 키 오류 또는 크레딧 부족
- **해결**:
  - https://platform.openai.com/account/api-keys 에서 키 확인
  - https://platform.openai.com/account/billing 에서 크레딧 확인

### 문제 5: "Module not found" (Python)
- **원인**: 가상환경 미활성화 또는 의존성 미설치
- **해결**:
  - 가상환경 활성화 확인: `which python` (venv 경로여야 함)
  - `pip install -r requirements.txt` 재실행

## ✅ 데모 시나리오

모든 설정이 완료되면 다음 시나리오로 테스트:

### 시나리오 1: 문서 업로드
1. 프론트엔드에서 `UploadFormBackend` 컴포넌트 사용
2. 텍스트 입력 또는 파일 업로드
3. 프로젝트 선택 (tech, work, personal 등)
4. "기억으로 저장" 클릭
5. 요약과 키워드가 자동 생성되는지 확인

### 시나리오 2: 검색 (Rerank OFF)
1. `SearchPanel` 컴포넌트에서 "비 오는 날 감성" 검색
2. Rerank 체크박스 OFF
3. 검색 결과 확인 (점수 순)

### 시나리오 3: 검색 (Rerank ON)
1. 같은 쿼리로 Rerank ON으로 검색
2. 결과 순서 변경 확인
3. Evidence 표시 확인 (보라색 표시)

### 시나리오 4: 답변 생성
1. 검색 결과가 있는 상태에서 "답변 생성" 클릭
2. AI가 생성한 답변과 핵심 포인트 3개 확인

## 📊 비용 예상

샘플 데이터 5개 업로드 + 검색 10회 기준:

- **OpenAI**
  - 임베딩: ~$0.01
  - 요약/키워드: ~$0.05
  - 답변 생성: ~$0.02
  - **합계: ~$0.08**

- **Cohere**
  - Rerank 10회: 무료 티어 범위 내

- **Pinecone**
  - 벡터 5개 저장: 무료 티어 범위 내

**총 비용: ~$0.10 이하**

## 🎯 다음 단계

모든 테스트가 성공하면:

1. 더 많은 샘플 데이터 업로드
2. 다양한 검색 쿼리 테스트
3. 프로젝트 필터 기능 테스트
4. 검색 범위 (요약/원문/둘 다) 비교
5. Top-K 값 변경하며 테스트

## 📝 참고 자료

- FastAPI 문서: https://fastapi.tiangolo.com/
- OpenAI API: https://platform.openai.com/docs
- Cohere Rerank: https://docs.cohere.com/docs/rerank
- Pinecone: https://docs.pinecone.io/

---

모든 항목을 체크했다면 프론트엔드에서 백엔드 API를 호출할 준비가 완료되었습니다! 🚀
