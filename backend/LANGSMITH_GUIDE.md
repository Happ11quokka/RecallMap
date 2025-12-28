# LangSmith 모니터링 가이드

LangSmith를 사용하여 RecallMap의 모든 LLM 호출을 실시간으로 추적하고 분석할 수 있습니다.

## 🎯 LangSmith란?

LangSmith는 LangChain이 제공하는 LLM 애플리케이션 모니터링 플랫폼입니다.

**주요 기능:**
- 모든 LLM 호출 추적 (요청/응답)
- 비용 분석 (토큰 사용량)
- 성능 모니터링 (응답 시간)
- 에러 추적 및 디버깅
- 프롬프트 비교 및 최적화

## 🚀 설정 방법

### 1. LangSmith API 키 발급

1. https://smith.langchain.com/ 접속 및 회원가입
2. Settings → API Keys 이동
3. "Create API Key" 클릭
4. 키 복사 (lsv2_로 시작)

**무료 플랜:**
- 월 5,000 traces까지 무료
- RecallMap 초기 테스트에 충분

### 2. 환경 변수 설정

`backend/.env` 파일에 추가:

```env
# LangSmith (Optional - for monitoring)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_your_actual_key_here
LANGCHAIN_PROJECT=recallmap
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
```

**설명:**
- `LANGCHAIN_TRACING_V2=true` - 추적 활성화
- `LANGCHAIN_API_KEY` - LangSmith API 키
- `LANGCHAIN_PROJECT` - 프로젝트 이름 (원하는 이름으로 변경 가능)
- `LANGCHAIN_ENDPOINT` - LangSmith 엔드포인트 (기본값)

### 3. 의존성 설치

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

langsmith 패키지가 자동으로 설치됩니다.

### 4. 서버 재시작

```bash
uvicorn app.main:app --reload
```

서버 시작 시 다음 메시지 확인:

```
✅ LangSmith 추적 활성화: recallmap
   Dashboard: https://smith.langchain.com/o/default/projects/p/recallmap
```

## 📊 사용 방법

### 1. LangSmith 대시보드 접속

서버 실행 후 로그에 표시된 URL 접속:
```
https://smith.langchain.com/o/default/projects/p/recallmap
```

또는 https://smith.langchain.com/ → Projects → recallmap

### 2. 추적 확인

#### 문서 업로드 시

1. 프론트엔드에서 문서 업로드
2. LangSmith에서 실시간으로 다음 추적 확인:
   - `generate_summary` - 요약 생성
   - `extract_keywords` - 키워드 추출
   - `generate_embedding` - 임베딩 생성

#### 검색 시

1. 검색 실행
2. LangSmith에서 확인:
   - `generate_embedding` - 쿼리 임베딩
   - `rerank_results` - Cohere Rerank (옵션)

#### 답변 생성 시

1. 답변 생성 클릭
2. LangSmith에서 확인:
   - `compose_answer` - GPT-4 답변 생성
   - 프롬프트, 응답, 토큰 수 모두 확인 가능

### 3. 로그에서 확인

터미널 로그에서도 추적 가능:

```
🔹 Summary generation - text length: 523
✅ Summary generated - length: 45

🔹 Embedding generation - text length: 578
✅ Embedding generated - dimension: 1536
```

## 🔍 주요 기능

### 1. Trace 상세 정보

각 LLM 호출마다 다음 정보 확인:

**Input (입력):**
- 프롬프트 전문
- 시스템 메시지
- 파라미터 (temperature, max_tokens 등)

**Output (출력):**
- 모델 응답
- 완료 시간
- 토큰 사용량 (입력/출력)

**Metadata:**
- 모델 이름 (gpt-4-turbo-preview)
- 비용 추정
- 에러 정보 (있는 경우)

### 2. 성능 분석

**Timeline View:**
- 각 단계별 소요 시간
- 병목 구간 식별
- 전체 요청 처리 시간

**예시:**
```
문서 업로드 (총 5.2초)
├── generate_summary: 2.1초
├── extract_keywords: 1.8초
└── generate_embedding: 0.5초
```

### 3. 비용 추적

**Token Usage:**
- 입력 토큰: 1,234 ($0.012)
- 출력 토큰: 567 ($0.034)
- 총 비용: $0.046

**누적 비용:**
- 일별/주별/월별 비용 그래프
- 모델별 비용 분석

### 4. 에러 디버깅

LLM 호출 실패 시:
- 에러 메시지 전문
- 실패한 프롬프트
- 재시도 이력
- 스택 트레이스

## 📈 활용 예시

### 시나리오 1: 프롬프트 최적화

**문제:** 요약이 너무 길게 생성됨

**해결 과정:**
1. LangSmith에서 `generate_summary` 추적 확인
2. 프롬프트 확인: "한 줄로 요약해주세요"
3. 응답 확인: 2문장 이상 생성됨
4. 프롬프트 수정: "최대 50자 이내 한 줄로"
5. 재테스트 후 비교

### 시나리오 2: 비용 분석

**질문:** 문서 10개 업로드 시 비용은?

**확인 방법:**
1. LangSmith → Analytics → Cost
2. 기간 필터: 오늘
3. 총 비용 확인
4. 문서당 평균 비용 계산

### 시나리오 3: 성능 개선

**목표:** 검색 속도 2초 이내로 단축

**분석:**
1. Timeline에서 병목 확인
2. Rerank가 1.5초 소요 확인
3. Top-K를 20 → 10으로 축소
4. 속도 개선 확인

## ⚙️ 고급 설정

### 1. 프로젝트 분리

개발/스테이징/프로덕션 환경 분리:

```env
# .env.dev
LANGCHAIN_PROJECT=recallmap-dev

# .env.staging
LANGCHAIN_PROJECT=recallmap-staging

# .env.prod
LANGCHAIN_PROJECT=recallmap-prod
```

### 2. 추적 비활성화

테스트 시 추적이 필요 없으면:

```env
# 주석 처리 또는 삭제
# LANGCHAIN_TRACING_V2=true
```

또는

```env
LANGCHAIN_TRACING_V2=false
```

### 3. 선택적 추적

특정 함수만 추적:

```python
from app.core.langsmith import trace_llm_call

@trace_llm_call("my_custom_function")
def my_function():
    # 이 함수만 LangSmith에 추적됨
    pass
```

## 🎯 데모 체크리스트

LangSmith로 데모할 때 보여줄 포인트:

- [ ] 실시간 추적 - 문서 업로드 시 LangSmith에 즉시 표시
- [ ] 프롬프트 가시성 - 실제 GPT-4에 전달된 프롬프트 확인
- [ ] 비용 투명성 - 정확한 토큰 사용량 및 비용
- [ ] 성능 모니터링 - 각 단계별 소요 시간
- [ ] 에러 추적 - 실패 시 자동 기록 및 알림

## 💡 팁

### 1. 커스텀 메타데이터

현재 구현된 메타데이터:

```python
{
    "operation": "summary",
    "text_length": 523,
    "max_length": 100
}
```

추가 정보가 필요하면 `llm_service.py`에서 확장 가능

### 2. 필터 활용

LangSmith에서 유용한 필터:

- 에러만 보기: `Status: Error`
- 느린 요청: `Latency > 5s`
- 비용 높은 요청: `Tokens > 1000`
- 특정 모델: `Model: gpt-4-turbo-preview`

### 3. 알림 설정

LangSmith에서 알림 설정 가능:

- 에러 발생 시 이메일
- 비용 임계값 초과 시
- 성능 저하 감지 시

## 🔗 참고 자료

- LangSmith 공식 문서: https://docs.smith.langchain.com/
- LangSmith 가격: https://www.langchain.com/pricing
- LangSmith 대시보드: https://smith.langchain.com/

## ❓ FAQ

**Q: LangSmith 없이도 동작하나요?**
A: 네! LangSmith는 선택 사항입니다. 환경 변수를 설정하지 않으면 자동으로 비활성화됩니다.

**Q: 비용이 추가로 발생하나요?**
A: LangSmith 자체는 월 5,000 traces까지 무료입니다. LLM 사용 비용은 동일합니다.

**Q: 프로덕션에서도 사용 가능한가요?**
A: 네! 단, 민감한 데이터는 필터링하는 것이 좋습니다.

**Q: OpenAI만 추적되나요?**
A: 현재는 OpenAI 호출만 추적됩니다. Cohere와 Pinecone은 별도 로깅만 됩니다.

---

**LangSmith를 활용하여 RecallMap의 LLM 성능을 실시간으로 모니터링하세요!** 🚀
