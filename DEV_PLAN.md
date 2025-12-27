# ContextNote 개발 계획서 (2명 체제 / React Web + Agent)

## 0) 목표
- **2명 체제(React Web UI 1명 + Agent/API 1명)**로 데모 완성
- "맥락 검색(Recall) → 글감 재사용(Reuse)"이 한 번에 설득되도록 구현

---

## 1) 팀 운영 방식(계약 먼저)

### Interface(계약) 먼저 고정
- React는 FastAPI의 **HTTP API + JSON 스키마**만 사용
- Agent/API는 UI를 몰라도 됨(스키마만 지키면 됨)
- UI는 먼저 Mock API로 화면 완성 → 백엔드 붙이기

### 단일 진실
- `backend/agent/schemas.py`가 request/response의 단일 기준

---

## 2) 개발 역할 분담

### A) React Web UI 담당(1명)
#### 화면(필수)
1) **Landing**
2) **Main(탭/사이드바)**
   - Capture
   - Recall
   - Reuse
3) (옵션) Network(아이디어 지도)

#### 공통 UX
- 로딩 단계 표시("의도 요약 중…", "검색 중…", "아웃라인 구성 중…")
- 결과 없음/에러 처리

#### 기술 선택(추천)
- Vite + React + TypeScript
- TanStack Query로 API 상태 관리
- UI 컴포넌트: shadcn/ui 또는 MUI(둘 중 하나)

---

### B) Agent/API 담당(1명)
- FastAPI 엔드포인트 구현
- OpenAI 호출부(embedding/why/outline/rerank)
- Pinecone upsert/query/fetch
- 토큰/latency 로그

---

## 3) 화면 상세 정의

### 3.1 Landing 페이지
목표: "10초 이해 + 데모 진입 + 시드 데이터 확보"

#### 구성
- Headline: "메모를 '왜 썼는지'로 다시 꺼내 쓰세요"
- CTA:
  - "데모 시작"
  - "샘플 데이터로 시작"(시드 생성 API 호출)
- 원칙 문장: "자동 정리/지도뷰는 기본 OFF, 필요할 때만 ON"

#### API
- (옵션) `POST /api/seed` 샘플 메모 N개 생성

---

### 3.2 Main 페이지(탭 기반)

#### 탭 1) Capture
- 입력: text, project(optional), why(optional)
- 버튼: 저장
- 결과: memo_id + why 표시(자동 생성 확인용)

#### 탭 2) Recall
- 입력: query, project(optional), top_k
- 결과: 카드 리스트(체크박스 포함)
  - id / why / text / score / evidence(옵션)
- 액션:
  - "선택 메모를 Reuse로 보내기"

#### 탭 3) Reuse
- 입력: goal
- 선택된 memo_ids 목록 표시(삭제/추가 가능)
- 버튼: "아웃라인 생성"
- 결과:
  - title
  - outline 섹션 리스트
  - 각 섹션 sources(trace) 표시

#### 탭 4) Network (옵션)
- "강한 연결(주제)" 버튼: 클러스터 중심 노드 강조
- "약한 연결(의외의 연결)" 버튼: 브리지 노드 강조
- 노드 클릭 → 우측 패널에 메모 상세(why/text)

---

## 4) AI/Agent 설계

### 4.1 Capture 파이프라인
- why 없으면 LLM로 1문장 생성
- embedding 생성
- Pinecone upsert(metadata: text/why/project/created_at)

### 4.2 Recall 파이프라인
- query embedding → Pinecone top50
- (추천) LLM rerank → top10
- evidence 1줄 생성(데모 설득력 상승)
- 카드 출력

### 4.3 Reuse 파이프라인
- memo_ids fetch
- LLM 아웃라인 생성
- 섹션별 sources(trace) 강제

---

## 5) API 계약(확정)

### 필수
- `POST /api/memos`
- `POST /api/search`
- `POST /api/bundle/outline`

### 옵션
- `POST /api/seed`
- `POST /api/link` (edge 생성)
- `GET /api/health`

---

## 6) 마일스톤(5일 추천)

### Day 1
- schemas.py 확정
- React: Landing + Main 뼈대 + Mock API
- FastAPI: 엔드포인트 뼈대(더미)

### Day 2
- /api/memos end-to-end
- React Capture 완성

### Day 3
- /api/search end-to-end
- React Recall 완성(선택/전달)

### Day 4
- /api/bundle/outline end-to-end
- React Reuse 완성(trace 표시)

### Day 5(추천)
- rerank + evidence 추가
- seed 버튼 추가(데모 안정화)

---

## 7) 데모 전 체크리스트
- seed로 "항상 되는" 시나리오 확보
- 결과 0개 UX 준비
- API 키 누락 안내
- 로딩 단계 메시지 세분화
- 네트워크 탭 없어도 데모 성립
