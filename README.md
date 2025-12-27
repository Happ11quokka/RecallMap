# ContextNote (Demo) — "맥락으로 다시 꺼내 쓰는" 메모-글쓰기 도구

> **한 줄 요약**
> 메모를 키워드가 아니라 **"왜 썼는지(맥락)"**로 찾아, 선택한 메모들로 **글 아웃라인까지** 바로 만들어주는 웹 데모 서비스.

---

## 1) 문제 정의

글을 쓰는 사람은 메모를 많이 남기지만,
- 시간이 지나면 **검색어(키워드)가 기억나지 않아** 못 찾고,
- 찾더라도 "왜 썼는지 / 어떤 문제의식이었는지"가 사라져 **재사용이 어렵고**,
- 메모가 쌓일수록 아카이브가 되어 **연결(통찰)**이 잘 드러나지 않습니다.

우리는 "정리 자체"보다 **기록과 기록을 연결하는 과정**이 가치라는 관점에서,
메모를 **맥락 단위로 회수(Recall)**하고 **연결(Connect)**해 **재사용(Reuse)**까지 이어주는 흐름을 구현합니다.

---

## 2) 핵심 피드백 반영 원칙

- 자동 정리/분류는 **항상 ON 기본값이 아니라** → 필요할 때만 쓰는 **선택형 도구**
- 아이디어 지도(네트워크 뷰)는 **작업 단계에 따라 ON/OFF**
- 3기능 중 MVP는 **맥락 검색(Recall)**에 집중
- 글을 다 쓴 이후에도: "이 글이 어떤 메모 흐름에서 나왔는지"를 추적(Trace)해 다음 글의 자산으로

---

## 3) 데모 시나리오(3분)

### (1) Capture: 메모 저장
- 메모 텍스트만 저장 가능
- `why(의도)`는 선택 입력(비어있으면 AI가 1줄 생성)

### (2) Recall: 질문형 검색(맥락 검색)
질문 예:
- "자동정리가 기본값이면 왜 위험하다고 적어놨지?"
- "기록의 가치는 연결이라는 논지 어디서 나왔지?"

결과 카드에:
- 원문(text)
- 의도(why)
- 근거(evidence) *(옵션)*
- 관련 메모 *(옵션)*

### (3) Reuse: 글감 묶음 → 아웃라인 생성
- 사용자가 4~6개 메모 선택 → 아웃라인 생성
- 각 섹션에 `sources: [memo_id]`로 출처(Trace) 표시

---

## 4) 사용자 / 인터뷰 계획

### 타깃(가설)
- 블로거/뉴스레터 작성자/마케터/기획자/연구자 등 "글을 쓰는 지식노동자"
- 메모는 많이 하지만 "다시 꺼내 쓰는 경험"이 약한 사람

### 인터뷰 질문(예시)
- 최근 "메모를 못 찾아서" 글을 못 쓴 사례 1개(상황/비용/대안)
- 찾았는데도 못 쓴 이유(맥락 부재/중복/품질/정리 과부하)
- 검색 결과에 무엇이 같이 나오면 바로 쓸 수 있나? (why/situation/source/관련메모)
- 자동분류가 항상 켜져 있으면 어떤 느낌인가? "버튼으로 필요할 때만"이면?

### 성공 지표(데모 기준)
- Search→Outline 전환율(검색 후 아웃라인 생성까지)
- "why가 도움이 됐다" 주관 평가(1~5)
- D7 재사용률(가능하면)

---

## 5) 기능 범위(MVP)

### Must
- 메모 저장(Capture) + (선택) why
- 저장 시 `why` 1줄 자동 생성(빈 경우)
- 벡터 검색(Recall) + 결과 카드(원문/why/score)
- 선택 메모 묶음 → 아웃라인 생성(Reuse) + sources(trace)

### Nice-to-have
- rerank(Top50→Top10 재정렬) + evidence 생성
- 연결(edge) 생성(강한/약한 연결 버튼)
- 네트워크 뷰(클러스터 색상/중심 노드 강조)

---

## 6) 기술 스택

### Frontend (Web)
- **React** (추천: Vite + TypeScript)
- 상태관리: TanStack Query(추천) 또는 SWR
- 네트워크 뷰(옵션): React Flow / Cytoscape.js / D3

### Backend
- **FastAPI** (API 계약 고정)
- OpenAI API (embedding / why / outline / rerank)

### Vector DB
- **Pinecone**

---

## 7) 아키텍처(요약)

- React Web → FastAPI
- FastAPI:
  - OpenAI Embeddings 생성 → Pinecone upsert/query/fetch
  - LLM로 why/outline/rerank 수행
- Pinecone metadata:
  - text(원문), why(의도 1줄), project, created_at 등

---

## 8) API 계약(요약)

### POST /api/memos
```json
{ "text": "...", "project": "default", "why": null, "source": "manual" }
```

→

```json
{ "id": "memo_xxx", "why": "한 문장 요약", "created_at": "..." }
```

### POST /api/search

```json
{ "query": "자동정리 기본값 위험", "project": "default", "top_k": 10 }
```

→

```json
{ "results": [ { "id": "...", "score": 0.81, "text": "...", "why": "...", "evidence": "..." } ] }
```

### POST /api/bundle/outline

```json
{ "goal": "서비스 차별화 정리", "memo_ids": ["memo_a", "memo_b"] }
```

→

```json
{ "title": "...", "outline": [ { "heading": "...", "bullets": ["..."], "sources": ["memo_a"] } ] }
```

---

## 9) 레포 구조(권장)

```
backend/
  main.py
  agent/
    schemas.py
    embeddings.py
    memos.py
    search.py
    outline.py
  infra/
    pinecone.py
    settings.py

frontend/
  src/
    pages/
      Landing.tsx
      AppShell.tsx
      Capture.tsx
      Recall.tsx
      Reuse.tsx
      Network.tsx        # optional
    api/
      client.ts
      memos.ts
      search.ts
      bundle.ts
```
