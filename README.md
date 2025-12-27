# NOVA - Nodes Of Valuable Archives

> 지식을 **연결**하고, **맥락**으로 다시 찾는 지식 관리 서비스

## 개요

NOVA는 흩어진 메모와 자료를 하나의 네트워크로 연결하는 서비스입니다.
자료 간의 관계를 시각화하고, 새로운 통찰을 발견하도록 도와드립니다.

## 핵심 기능

### 1. 자료 저장 (Capture)
- 텍스트 입력 + 형식 선택 (기사/논문/메모/아이디어)
- 자료를 접한 맥락 함께 저장
- LocalStorage에 데이터 저장 (브라우저에 유지)

### 2. 네트워크 뷰 (Network View)
- React Flow 기반 인터랙티브 네트워크 시각화
- 노드 간 관계 강도에 따른 엣지 표현
- 형식별 색상 구분
- 드래그/줌 인터랙션

### 3. Agent 뷰 (Agent View)
- 자연어 검색 기능 (Mock)
- 주제별 클러스터 분석 (강한 연결)
- 브리지 노드 탐색 (약한 연결)

### 4. 활동 로그
- 참고한 노드 자동 기록
- 세션별 로그 관리
- JSON 형식 내보내기

## 기술 스택

- React 18 + TypeScript
- Vite
- React Flow (네트워크 시각화)
- TanStack Query (상태 관리)
- Zustand (클라이언트 상태 관리)
- Tailwind CSS
- LocalStorage (데이터 저장)

## 실행 방법

```bash
# 1. frontend 폴더로 이동
cd frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 프로젝트 구조

```
frontend/
├── package.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── api/           # Mock API
    │   ├── nodes.ts
    │   ├── search.ts
    │   ├── agent.ts
    │   └── logs.ts
    ├── mocks/         # Mock 데이터
    │   └── data.ts
    ├── components/
    │   ├── NetworkView.tsx
    │   ├── AgentChat.tsx
    │   ├── UploadForm.tsx
    │   ├── NodeCard.tsx
    │   └── ActivityLog.tsx
    ├── pages/
    │   ├── Landing.tsx
    │   └── MainApp.tsx
    ├── store/
    │   └── useAppStore.ts
    └── types/
        └── index.ts
```

## Agent 질문 예시

- "주제별로 분류해줘"
- "약한 연결을 찾아줘"
- "AI 관련 자료 검색해줘"
