# RecallMap 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 필수 준비물

- Python 3.11+
- Node.js 18+
- OpenAI API Key
- Cohere API Key
- Pinecone API Key

---

## Step 1: API 키 발급 (5분)

### 1.1 OpenAI

1. https://platform.openai.com/api-keys 접속
2. "+ Create new secret key" 클릭
3. 키 복사 (sk-proj-로 시작)

### 1.2 Cohere

1. https://dashboard.cohere.ai/api-keys 접속
2. Trial key 복사

### 1.3 Pinecone

1. https://app.pinecone.io/ 회원가입
2. API Keys → Create API Key
3. Region 확인 (예: us-east-1)

---

## Step 2: 백엔드 실행 (2분)

```bash
cd backend

# 환경 변수 설정
cp .env.example .env
# .env 파일 열어서 API 키 3개 입력

# 가상환경 및 실행
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

kill -9 $(lsof -ti:8000)

**확인:** http://localhost:8000/docs 접속되면 성공!

---

## Step 3: 프론트엔드 실행 (1분)

**새 터미널에서:**

```bash
cd frontend

# 환경 변수 설정
cp .env.example .env
# 기본값 그대로 사용 가능

# 실행
npm install
npm run dev
```

**확인:** http://localhost:5173 접속되면 성공!

---

## Step 4: 첫 테스트 (2분)

### 방법 1: 웹 UI 사용

1. http://localhost:5173 접속
2. `UploadFormBackend` 컴포넌트 추가 필요 (아래 참조)
3. 텍스트 입력 후 "기억으로 저장"
4. `SearchPanel` 컴포넌트로 검색

### 방법 2: API 직접 테스트

**프로젝트 루트에서:**

```bash
python test_api.py
```

자동으로:

- 샘플 파일 5개 업로드
- 다양한 검색 시나리오 실행
- Rerank ON/OFF 비교
- 답변 생성

---

## Step 5: 프론트엔드 컴포넌트 추가

### 기존 페이지에 백엔드 연동 컴포넌트 추가

**예시: MainApp.tsx 수정**

```tsx
// 상단에 import 추가
import UploadFormBackend from '@/components/UploadFormBackend';
import SearchPanel from '@/components/SearchPanel';

// 기존 UploadForm 대신 사용
<UploadFormBackend onSuccess={() => console.log('업로드 완료')} />

// 검색 패널 추가
<SearchPanel />
```

---

## 🎯 첫 데모 시나리오

### 1. 문서 업로드

- **입력:** "FastAPI는 빠른 Python 웹 프레임워크입니다. 성능이 뛰어나고 사용하기 쉽습니다."
- **프로젝트:** tech
- **결과:** 요약 + 키워드 자동 생성

### 2. 검색 (Rerank OFF)

- **쿼리:** "FastAPI 성능"
- **Rerank:** OFF
- **결과:** 유사도 점수 순으로 정렬

### 3. 검색 (Rerank ON)

- **쿼리:** "FastAPI 성능"
- **Rerank:** ON
- **결과:** 관련성 순 + Evidence 표시

### 4. 답변 생성

- 검색 결과에서 "답변 생성" 클릭
- AI가 요약 + 핵심 포인트 3개 생성

---

## ⚠️ 문제 해결

### "Connection refused"

→ 백엔드가 실행 중인지 확인 (`http://localhost:8000/health`)

### "CORS error"

→ 백엔드 `app/main.py`에서 `allow_origins` 확인

### "API key invalid"

→ `.env` 파일에서 API 키 재확인

### "Module not found"

→ 가상환경 활성화 확인 (`which python`)

---

## 📁 주요 파일 위치

```
RecallMap/
├── backend/
│   ├── .env                    ← API 키 설정
│   └── app/main.py            ← FastAPI 앱
│
├── frontend/
│   ├── .env                    ← 백엔드 URL 설정
│   └── src/
│       ├── api/backend.ts     ← API 클라이언트
│       └── components/
│           ├── UploadFormBackend.tsx
│           └── SearchPanel.tsx
│
├── sample_data/               ← 샘플 txt 파일들
├── test_api.py               ← API 테스트 스크립트
└── SETUP_CHECKLIST.md        ← 상세 가이드
```

---

## 💡 다음 단계

✅ 기본 실행 완료 후:

1. [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - 상세 설정 가이드
2. [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 아키텍처
3. [backend/README.md](backend/README.md) - 백엔드 API 문서

---

**전체 소요 시간: 약 10-15분**

문제가 생기면 [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)의 문제 해결 섹션을 참고하세요! 🚀
