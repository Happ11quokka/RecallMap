# RecallMap 프론트엔드-백엔드 연동 가이드

## 📌 현재 상태

### ✅ 완료된 구현
- **백엔드**: FastAPI + OpenAI + Cohere + Pinecone 완전 구현
- **API 클라이언트**: `frontend/src/api/backend.ts` 작성 완료
- **연동 컴포넌트**:
  - `UploadFormBackend.tsx` (문서 업로드)
  - `SearchPanel.tsx` (검색 + 답변 생성)
- **환경 변수**: 백엔드/프론트엔드 .env 파일 설정 완료
- **샘플 데이터**: 5개 txt 파일 준비
- **테스트 스크립트**: `test_api.py` 준비

### ⚠️ 필요한 작업
1. **API 키 입력**: `backend/.env` 파일에 실제 키 입력 필요
2. **컴포넌트 교체**: 기존 mock 컴포넌트 → 백엔드 연동 컴포넌트
3. **백엔드 실행**: 의존성 설치 및 서버 실행

---

## 🔧 수정이 필요한 파일들

### 1. 백엔드 환경 변수 (필수)

**파일**: `backend/.env`

```env
# 현재 상태: 예시 값들이 들어있음
# 해야 할 일: 실제 API 키로 교체

OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
COHERE_API_KEY=YOUR_ACTUAL_KEY_HERE
PINECONE_API_KEY=YOUR_ACTUAL_KEY_HERE
PINECONE_ENVIRONMENT=us-east-1  # 실제 region
PINECONE_INDEX_NAME=recallmap
```

### 2. 프론트엔드 컴포넌트 교체 (권장)

기존 프론트엔드는 mock API를 사용하고 있습니다. 백엔드와 연동하려면 컴포넌트를 교체해야 합니다.

#### Option A: 새 페이지 만들기 (권장)

**새 파일**: `frontend/src/pages/BackendDemo.tsx`

```tsx
import UploadFormBackend from '@/components/UploadFormBackend';
import SearchPanel from '@/components/SearchPanel';

export default function BackendDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          RecallMap - Backend Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 업로드 섹션 */}
          <div>
            <UploadFormBackend
              onSuccess={() => console.log('업로드 성공')}
            />
          </div>

          {/* 검색 섹션 */}
          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**라우터 추가**: `frontend/src/App.tsx`

```tsx
import BackendDemo from '@/pages/BackendDemo';

// 라우트 추가
<Route path="/demo" element={<BackendDemo />} />
```

접속: http://localhost:5173/demo

#### Option B: 기존 컴포넌트 교체

**파일**: `frontend/src/pages/MainApp.tsx` 또는 해당 페이지

```tsx
// 기존
import UploadForm from '@/components/UploadForm';

// 변경
import UploadFormBackend from '@/components/UploadFormBackend';

// 사용
<UploadFormBackend onSuccess={() => console.log('성공')} />
```

---

## 🚀 실행 순서

### 1단계: 백엔드 실행

```bash
cd backend

# API 키 입력 (필수!)
# .env 파일 열어서 실제 키 입력

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**확인:**
```bash
curl http://localhost:8000/health
# 응답: {"status":"healthy"}
```

### 2단계: 프론트엔드 실행

**새 터미널:**

```bash
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

**확인:**
- http://localhost:5173 접속
- 콘솔에 에러 없는지 확인

### 3단계: API 연동 테스트

**방법 1: Python 스크립트**

```bash
# 프로젝트 루트에서
python test_api.py
```

**방법 2: curl**

```bash
# 문서 업로드
curl -X POST http://localhost:8000/api/documents/upload-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "FastAPI는 빠른 Python 웹 프레임워크입니다.",
    "project": "tech",
    "filename": "test.txt"
  }'

# 검색
curl -X POST http://localhost:8000/api/documents/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "FastAPI",
    "search_scope": "both",
    "top_k": 5,
    "use_rerank": true
  }'
```

### 4단계: 웹 UI 테스트

1. http://localhost:5173/demo 접속 (새 페이지 만든 경우)
2. 또는 기존 페이지에서 컴포넌트 사용
3. 텍스트 입력 후 "기억으로 저장" 클릭
4. 요약/키워드 생성 확인
5. 검색 쿼리 입력 후 검색
6. "답변 생성" 클릭

---

## 🔍 API 엔드포인트 정리

### 문서 업로드

**POST** `/api/documents/upload-text`

```typescript
// 요청
{
  text: string;
  project: string;  // work, tech, personal, other
  filename?: string;
}

// 응답
{
  id: string;
  summary: string;  // AI 생성 요약
  keywords: string[];  // AI 추출 키워드
  preview: string;
  project: string;
  created_at: string;
  embedding_stored: boolean;
}
```

### 검색

**POST** `/api/documents/search`

```typescript
// 요청
{
  query: string;
  project?: string;  // 필터 (선택)
  search_scope: 'summary' | 'content' | 'both';
  top_k: number;  // 1-50
  use_rerank: boolean;  // Rerank 사용 여부
}

// 응답
{
  query: string;
  results: SearchResultItem[];
  reranked: boolean;
  total_found: number;
}

// SearchResultItem
{
  id: string;
  score: number;
  summary: string;
  preview: string;
  keywords: string[];
  project: string;
  filename?: string;
  evidence?: string;  // Rerank 시 생성
  created_at: string;
}
```

### 답변 생성

**POST** `/api/documents/answer`

```typescript
// 요청
{
  query: string;
  top_results: SearchResultItem[];
  max_results_to_use?: number;  // 기본 3
}

// 응답
{
  answer: string;  // AI 생성 답변 (2-6문장)
  highlights: string[];  // 핵심 포인트 3개
  source_documents: SearchResultItem[];
}
```

---

## 🎯 데모 시나리오

### 시나리오 1: 기본 업로드 & 검색

```typescript
// 1. 업로드
await uploadText({
  text: "비가 오는 날이면 항상 생각나는 카페가 있다...",
  project: "personal",
  filename: "rainy_day.txt"
});

// 2. 검색 (Rerank OFF)
const results = await searchDocuments({
  query: "비 오는 날 감성",
  use_rerank: false,
  top_k: 5
});

// 3. 검색 (Rerank ON)
const reranked = await searchDocuments({
  query: "비 오는 날 감성",
  use_rerank: true,
  top_k: 5
});

// 결과 비교: Rerank ON 시 순서 변경 + evidence 추가
```

### 시나리오 2: 프로젝트 필터 활용

```typescript
// tech 프로젝트만 검색
const techResults = await searchDocuments({
  query: "성능 최적화",
  project: "tech",
  search_scope: "both",
  use_rerank: true,
  top_k: 10
});
```

### 시나리오 3: 답변 생성

```typescript
// 검색 후 답변 생성
const results = await searchDocuments({
  query: "FastAPI 성능 최적화 방법",
  project: "tech",
  use_rerank: true
});

const answer = await composeAnswer({
  query: "FastAPI 성능 최적화 방법",
  top_results: results.results,
  max_results_to_use: 3
});

// answer.answer: "FastAPI 성능을 최적화하려면..."
// answer.highlights: ["비동기 처리 활용", "워커 수 조정", ...]
```

---

## 📊 예상 비용 (테스트 기준)

**샘플 5개 업로드 + 검색 10회:**

| 서비스 | 사용량 | 예상 비용 |
|--------|--------|-----------|
| OpenAI (임베딩) | ~5K tokens | $0.0005 |
| OpenAI (요약) | ~10K tokens | $0.10 |
| OpenAI (답변) | ~2K tokens | $0.02 |
| Cohere (Rerank) | 10회 | 무료 |
| Pinecone | 5 벡터 | 무료 |
| **합계** | | **~$0.12** |

무료 티어만으로도 충분히 테스트 가능합니다!

---

## ⚠️ 주의사항

### 1. API 키 보안
- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 이미 추가되어 있음

### 2. CORS 설정
- 백엔드 `app/main.py`의 `allow_origins`에 프론트엔드 URL 포함 확인
- 기본값: `http://localhost:5173` (Vite 개발 서버)

### 3. Pinecone 인덱스
- 첫 실행 시 자동으로 인덱스 생성됨 (1-2분 소요)
- `PINECONE_INDEX_NAME`을 변경하면 새 인덱스 생성

### 4. 모델 선택
- `backend/.env`에서 모델 변경 가능
- GPT-4 → GPT-3.5-turbo로 변경하면 비용 절감

---

## 🐛 문제 해결

### "Module 'openai' not found"
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "CORS policy error"
백엔드 `app/main.py` 확인:
```python
allow_origins=[
    "http://localhost:5173",  # ← 이 줄이 있는지 확인
]
```

### "Pinecone index not found"
- 첫 실행 시 자동 생성까지 1-2분 대기
- 로그에서 "Creating Pinecone index" 메시지 확인

### "API key invalid"
- `.env` 파일에서 앞뒤 따옴표 제거
- 키 복사 시 공백 포함 여부 확인

---

## 📝 다음 단계

✅ 기본 연동 완료 후:

1. 더 많은 문서 업로드 (10-50개)
2. 다양한 검색 쿼리 테스트
3. Rerank ON/OFF 효과 비교
4. 검색 범위별 결과 차이 확인
5. 프로젝트별 분류 활용

---

## 🔗 관련 문서

- [QUICK_START.md](QUICK_START.md) - 빠른 시작 가이드
- [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - 상세 체크리스트
- [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 아키텍처
- [backend/README.md](backend/README.md) - 백엔드 문서
- Swagger UI: http://localhost:8000/docs

---

**모든 준비가 완료되었습니다! 🎉**

이제 `backend/.env`에 API 키만 입력하면 바로 테스트할 수 있습니다.
