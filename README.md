# RecallMap

> 파일을 **기억**으로 바꾸고, **맥락**으로 다시 찾는 지식 관리 서비스

## 개요

RecallMap은 텍스트 파일을 업로드하면 자동으로 요약, 키워드, 임베딩을 생성하여 "기억 카드"로 만들어줍니다.
나중에 자연어로 검색하면 AI가 가장 관련 있는 문서를 찾아주고, 답변까지 생성해줍니다.

**데모용 핵심 기능:**
- 파일을 "기억"으로 변환 (Ingest)
- 자연어로 검색 (Search)
- 재랭킹으로 정확도 향상 (Rerank)
- 답변 자동 생성 (Answer Compose)

## 주요 기능

### 1. 파일을 "기억"으로 바꾸기 (Ingest)

사용자가 텍스트 파일을 업로드하면:
- **한 줄 요약** 자동 생성
- **키워드** 자동 추출
- **미리보기** 생성
- **임베딩** 생성 및 Pinecone 벡터 DB 저장
- **프로젝트별** 분류 (work, tech, personal 등)

### 2. 기억을 "찾기" (Search)

자연어 질문으로 검색:
- 검색 범위 선택: 요약만 / 원문만 / 둘 다
- 프로젝트 필터 (선택적)
- Top-K 결과 반환

### 3. 정확하게 재정렬 (Rerank)

Cohere Rerank API로 결과를 재정렬:
- 질문과 가장 관련 있는 순서로 재배치
- 각 결과에 **evidence(근거)** 추가
- 데모에서 "똑똑해 보이는" 핵심 기능

### 4. 최종 답변 만들기 (Answer Compose)

검색 결과를 종합하여:
- 2-6문장 요약 답변
- 핵심 포인트 3개
- 근거 문서 카드

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite
- TanStack Query
- Tailwind CSS

### Backend
- FastAPI
- OpenAI API (임베딩, 요약, 답변)
- Cohere API (Rerank)
- Pinecone (벡터 DB)

## 빠른 시작

### 1. 백엔드 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일에 API 키 입력 (OPENAI_API_KEY, COHERE_API_KEY, PINECONE_API_KEY)

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

백엔드 API: http://localhost:8000
Swagger 문서: http://localhost:8000/docs

### 2. 프론트엔드 실행

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# 개발 서버 실행
npm run dev
```

프론트엔드: http://localhost:5173

## 프로젝트 구조

```
RecallMap/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── main.py            # FastAPI 앱
│   │   ├── core/
│   │   │   └── config.py      # 설정
│   │   ├── api/
│   │   │   └── documents.py   # API 라우터
│   │   ├── services/
│   │   │   ├── llm_service.py        # LLM 서비스
│   │   │   ├── vector_db.py          # Pinecone
│   │   │   └── document_service.py   # 문서 관리
│   │   └── schemas/
│   │       └── document.py    # Pydantic 스키마
│   ├── requirements.txt
│   └── README.md
│
└── frontend/                   # React 프론트엔드
    ├── src/
    │   ├── api/
    │   │   └── backend.ts     # 백엔드 API 클라이언트
    │   ├── components/
    │   ├── pages/
    │   └── types/
    └── README.md
```

## API 엔드포인트

### 문서 업로드
- `POST /api/documents/upload` - 파일 업로드
- `POST /api/documents/upload-text` - 텍스트 직접 업로드

### 검색
- `POST /api/documents/search` - 문서 검색 (rerank 옵션)

### 답변 생성
- `POST /api/documents/answer` - 검색 결과 기반 답변 생성

### 통계
- `GET /api/documents/stats` - 벡터 DB 통계

자세한 API 문서는 http://localhost:8000/docs 참조

## 데모 시나리오

### 시나리오 1: 감성 글 찾기
- 입력: "비 오는 날 감성적인 글"
- Rerank ON → 관련 문서가 위로 + evidence 표시

### 시나리오 2: 기술 노트 찾기
- 입력: "FastAPI 성능 최적화"
- 프로젝트 필터: tech_blog
- 요약만 검색 → 빠른 결과

### 시나리오 3: Rerank ON/OFF 비교
- 같은 쿼리로 두 번 검색
- OFF: 비슷한 글들이 섞임
- ON: 정확한 순서 + 근거 표시 → 데모 핵심

## 환경 변수

### Backend (.env)
```env
OPENAI_API_KEY=sk-...
COHERE_API_KEY=...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=recallmap
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 문제 해결

### Pinecone 연결 오류
- API 키와 region 확인
- 인덱스가 자동 생성됩니다 (첫 실행 시)

### OpenAI API 오류
- API 키 확인
- 크레딧 잔액 확인

### CORS 오류
- 백엔드 CORS 설정에 프론트엔드 URL 포함 확인
- 프론트엔드 .env에 백엔드 URL 정확히 입력

## 라이선스

MIT
