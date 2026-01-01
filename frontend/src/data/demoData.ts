import type { GraphData, ReferencedNode } from '@/types';

// 클러스터 ID 매핑 (노드별 클러스터 지정)
export const nodeClusterMap: Record<string, number> = {
  // 클러스터 0: AI/머신러닝 (8개)
  demo_1: 0, demo_2: 0, demo_3: 0, demo_4: 0, demo_5: 0, demo_6: 0, demo_7: 0, demo_8: 0,
  // 클러스터 1: 웹 개발 (7개)
  demo_9: 1, demo_10: 1, demo_11: 1, demo_12: 1, demo_13: 1, demo_14: 1, demo_15: 1,
  // 클러스터 2: 창작/글쓰기 (6개)
  demo_16: 2, demo_17: 2, demo_18: 2, demo_19: 2, demo_20: 2, demo_21: 2,
  // 클러스터 3: 비즈니스/업무 (6개)
  demo_22: 3, demo_23: 3, demo_24: 3, demo_25: 3, demo_26: 3, demo_27: 3,
  // 클러스터 4: 학습/자기계발 (6개)
  demo_28: 4, demo_29: 4, demo_30: 4, demo_31: 4, demo_32: 4, demo_33: 4,
  // 클러스터 5: 데이터/분석 (7개)
  demo_34: 5, demo_35: 5, demo_36: 5, demo_37: 5, demo_38: 5, demo_39: 5, demo_40: 5,
};

// 데모용 40개 노드 데이터 - 다양한 주제의 실제 콘텐츠
export const demoNodes = [
  // 클러스터 0: AI/머신러닝 관련 (8개)
  { id: 'demo_1', label: 'GPT-4 아키텍처', summary: 'GPT-4의 트랜스포머 아키텍처와 어텐션 메커니즘에 대한 분석', keywords: ['GPT-4', 'Transformer', 'Attention', 'LLM'], project: 'tech' },
  { id: 'demo_2', label: 'RAG 시스템 구현', summary: 'Retrieval-Augmented Generation을 활용한 지식 기반 AI 시스템 구현 방법', keywords: ['RAG', 'Vector DB', 'Embedding', 'LangChain'], project: 'tech' },
  { id: 'demo_3', label: '프롬프트 엔지니어링', summary: '효과적인 프롬프트 작성을 위한 기법과 베스트 프랙티스', keywords: ['Prompt', 'Engineering', 'Few-shot', 'Chain-of-thought'], project: 'tech' },
  { id: 'demo_4', label: '벡터 임베딩 이해', summary: '텍스트를 벡터로 변환하는 임베딩 기술과 유사도 검색 원리', keywords: ['Embedding', 'Vector', 'Similarity', 'Cosine'], project: 'tech' },
  { id: 'demo_5', label: 'Fine-tuning 가이드', summary: 'LLM 파인튜닝을 위한 데이터 준비부터 학습까지의 전체 과정', keywords: ['Fine-tuning', 'LoRA', 'PEFT', 'Training'], project: 'tech' },
  { id: 'demo_6', label: 'AI 에이전트 설계', summary: '자율적으로 작업을 수행하는 AI 에이전트의 설계 패턴과 구현', keywords: ['Agent', 'Autonomous', 'Planning', 'Tool-use'], project: 'tech' },
  { id: 'demo_7', label: 'LLM 평가 지표', summary: 'BLEU, ROUGE, Perplexity 등 언어 모델 성능 평가 방법론', keywords: ['Evaluation', 'BLEU', 'ROUGE', 'Benchmark'], project: 'tech' },
  { id: 'demo_8', label: 'Hallucination 방지', summary: 'LLM의 환각 현상을 줄이기 위한 기술적 접근 방법', keywords: ['Hallucination', 'Grounding', 'Factuality', 'RAG'], project: 'tech' },

  // 클러스터 1: 웹 개발 관련 (7개)
  { id: 'demo_9', label: 'React 18 신기능', summary: 'Concurrent Mode, Suspense, Server Components 등 React 18의 주요 변화', keywords: ['React', 'Concurrent', 'Suspense', 'RSC'], project: 'tech' },
  { id: 'demo_10', label: 'Next.js App Router', summary: 'Next.js 13+ App Router의 새로운 라우팅 패러다임과 사용법', keywords: ['Next.js', 'App Router', 'RSC', 'Streaming'], project: 'tech' },
  { id: 'demo_11', label: 'TypeScript 타입 시스템', summary: 'TypeScript의 고급 타입 기능: 제네릭, 조건부 타입, 매핑 타입', keywords: ['TypeScript', 'Generic', 'Type', 'Inference'], project: 'tech' },
  { id: 'demo_12', label: 'TailwindCSS 활용', summary: 'Utility-first CSS 프레임워크 TailwindCSS의 효율적인 사용법', keywords: ['Tailwind', 'CSS', 'Utility', 'Design'], project: 'tech' },
  { id: 'demo_13', label: 'REST vs GraphQL', summary: 'REST API와 GraphQL의 장단점 비교 및 선택 기준', keywords: ['REST', 'GraphQL', 'API', 'Query'], project: 'tech' },
  { id: 'demo_14', label: '웹 성능 최적화', summary: 'Core Web Vitals 개선을 위한 프론트엔드 최적화 전략', keywords: ['Performance', 'CWV', 'Optimization', 'Lighthouse'], project: 'tech' },
  { id: 'demo_15', label: '상태 관리 비교', summary: 'Redux, Zustand, Jotai, Recoil 등 상태 관리 라이브러리 비교', keywords: ['State', 'Redux', 'Zustand', 'Jotai'], project: 'tech' },

  // 클러스터 2: 창작/글쓰기 관련 (6개)
  { id: 'demo_16', label: '스토리텔링 구조', summary: '3막 구조, 영웅의 여정 등 이야기 전개의 기본 프레임워크', keywords: ['Story', 'Structure', 'Narrative', 'Plot'], project: 'personal' },
  { id: 'demo_17', label: '캐릭터 아크 설계', summary: '캐릭터의 성장과 변화를 설득력 있게 그리는 방법', keywords: ['Character', 'Arc', 'Development', 'Growth'], project: 'personal' },
  { id: 'demo_18', label: '대화문 작성법', summary: '자연스럽고 캐릭터성을 드러내는 대화문 작성 기술', keywords: ['Dialogue', 'Writing', 'Voice', 'Character'], project: 'personal' },
  { id: 'demo_19', label: '세계관 구축', summary: '일관성 있는 가상 세계를 만들기 위한 설정과 규칙', keywords: ['Worldbuilding', 'Setting', 'Lore', 'Consistency'], project: 'personal' },
  { id: 'demo_20', label: '글쓰기 루틴', summary: '꾸준히 글을 쓰기 위한 습관과 환경 만들기', keywords: ['Writing', 'Routine', 'Habit', 'Productivity'], project: 'personal' },
  { id: 'demo_21', label: '퇴고와 수정', summary: '초고를 다듬어 완성도 높은 글로 만드는 퇴고 과정', keywords: ['Editing', 'Revision', 'Draft', 'Polish'], project: 'personal' },

  // 클러스터 3: 비즈니스/업무 관련 (6개)
  { id: 'demo_22', label: '애자일 스크럼', summary: '스프린트, 데일리 스탠드업 등 애자일 방법론의 핵심 요소', keywords: ['Agile', 'Scrum', 'Sprint', 'Standup'], project: 'work' },
  { id: 'demo_23', label: 'OKR 설정 방법', summary: '목표와 핵심 결과를 효과적으로 설정하고 추적하는 방법', keywords: ['OKR', 'Goals', 'KPI', 'Alignment'], project: 'work' },
  { id: 'demo_24', label: '효과적인 회의', summary: '시간을 아끼고 결과를 내는 회의 운영 노하우', keywords: ['Meeting', 'Facilitation', 'Agenda', 'Action'], project: 'work' },
  { id: 'demo_25', label: '코드 리뷰 문화', summary: '건설적인 코드 리뷰를 위한 가이드라인과 팁', keywords: ['Code Review', 'Feedback', 'PR', 'Best Practice'], project: 'work' },
  { id: 'demo_26', label: '기술 문서화', summary: 'README, API 문서, 아키텍처 문서 작성 가이드', keywords: ['Documentation', 'README', 'API Doc', 'Architecture'], project: 'work' },
  { id: 'demo_27', label: '온보딩 프로세스', summary: '신규 팀원이 빠르게 적응할 수 있는 온보딩 설계', keywords: ['Onboarding', 'Training', 'Ramp-up', 'Culture'], project: 'work' },

  // 클러스터 4: 학습/자기계발 관련 (6개)
  { id: 'demo_28', label: '효과적인 노트 테이킹', summary: '코넬 노트, 제텔카스텐 등 지식 정리 방법론', keywords: ['Note-taking', 'Zettelkasten', 'Cornell', 'PKM'], project: 'personal' },
  { id: 'demo_29', label: '딥워크 실천', summary: '깊은 집중을 통한 생산성 향상 전략', keywords: ['Deep Work', 'Focus', 'Concentration', 'Productivity'], project: 'personal' },
  { id: 'demo_30', label: '스페이스드 반복', summary: '장기 기억을 위한 간격 반복 학습법', keywords: ['Spaced Repetition', 'Memory', 'Anki', 'Learning'], project: 'personal' },
  { id: 'demo_31', label: '마인드맵 활용', summary: '아이디어를 시각화하고 연결하는 마인드맵 기법', keywords: ['Mind Map', 'Visual', 'Brainstorm', 'Connection'], project: 'personal' },
  { id: 'demo_32', label: '독서 노트 정리', summary: '책에서 얻은 인사이트를 체계적으로 정리하는 방법', keywords: ['Reading', 'Notes', 'Summary', 'Insight'], project: 'personal' },
  { id: 'demo_33', label: '습관 형성', summary: '새로운 습관을 만들고 유지하는 과학적 접근법', keywords: ['Habit', 'Routine', 'Behavior', 'Atomic'], project: 'personal' },

  // 클러스터 5: 데이터/분석 관련 (7개)
  { id: 'demo_34', label: 'SQL 쿼리 최적화', summary: '인덱스, 실행 계획을 활용한 SQL 성능 튜닝', keywords: ['SQL', 'Index', 'Query', 'Optimization'], project: 'tech' },
  { id: 'demo_35', label: 'Python 데이터 분석', summary: 'Pandas, NumPy를 활용한 데이터 전처리와 분석', keywords: ['Python', 'Pandas', 'NumPy', 'Analysis'], project: 'tech' },
  { id: 'demo_36', label: '데이터 시각화', summary: 'Matplotlib, Seaborn, Plotly를 활용한 효과적인 시각화', keywords: ['Visualization', 'Chart', 'Matplotlib', 'Plotly'], project: 'tech' },
  { id: 'demo_37', label: 'A/B 테스트 설계', summary: '통계적으로 유의미한 A/B 테스트 설계와 분석', keywords: ['A/B Test', 'Statistics', 'Hypothesis', 'Significance'], project: 'work' },
  { id: 'demo_38', label: '대시보드 설계', summary: '핵심 지표를 효과적으로 보여주는 대시보드 구성', keywords: ['Dashboard', 'KPI', 'Metrics', 'BI'], project: 'work' },
  { id: 'demo_39', label: '데이터 파이프라인', summary: 'ETL/ELT 파이프라인 구축과 데이터 품질 관리', keywords: ['ETL', 'Pipeline', 'Airflow', 'Data Quality'], project: 'tech' },
  { id: 'demo_40', label: '머신러닝 파이프라인', summary: 'MLOps를 위한 모델 학습, 배포, 모니터링 자동화', keywords: ['MLOps', 'Pipeline', 'Deployment', 'Monitoring'], project: 'tech' },
];

// 엣지 데이터 - 이미지처럼 네트워크 느낌의 많은 연결
export const demoEdges = [
  // 클러스터 내부 연결 (같은 색 노드끼리)
  // AI/ML 내부
  { source: 'demo_1', target: 'demo_2', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_2', target: 'demo_4', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_3', target: 'demo_5', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_4', target: 'demo_6', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_5', target: 'demo_7', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_6', target: 'demo_8', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_1', target: 'demo_4', weight: 0.5, edge_type: 'vector' as const },
  { source: 'demo_3', target: 'demo_7', weight: 0.55, edge_type: 'vector' as const },

  // 웹개발 내부
  { source: 'demo_9', target: 'demo_10', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_10', target: 'demo_11', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_11', target: 'demo_12', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_12', target: 'demo_14', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_13', target: 'demo_15', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_9', target: 'demo_14', weight: 0.5, edge_type: 'vector' as const },

  // 창작 내부
  { source: 'demo_16', target: 'demo_17', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_17', target: 'demo_18', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_18', target: 'demo_19', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_19', target: 'demo_20', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_20', target: 'demo_21', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_16', target: 'demo_19', weight: 0.5, edge_type: 'vector' as const },

  // 비즈니스 내부
  { source: 'demo_22', target: 'demo_23', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_23', target: 'demo_24', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_24', target: 'demo_25', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_25', target: 'demo_26', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_26', target: 'demo_27', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_22', target: 'demo_25', weight: 0.5, edge_type: 'vector' as const },

  // 학습 내부
  { source: 'demo_28', target: 'demo_29', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_29', target: 'demo_30', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_30', target: 'demo_31', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_31', target: 'demo_32', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_32', target: 'demo_33', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_28', target: 'demo_31', weight: 0.5, edge_type: 'vector' as const },

  // 데이터 내부
  { source: 'demo_34', target: 'demo_35', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_35', target: 'demo_36', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_36', target: 'demo_37', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_37', target: 'demo_38', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_38', target: 'demo_39', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_39', target: 'demo_40', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_34', target: 'demo_37', weight: 0.5, edge_type: 'vector' as const },

  // 클러스터 간 연결 (약한 연결)
  { source: 'demo_5', target: 'demo_40', weight: 0.4, edge_type: 'vector' as const },
  { source: 'demo_4', target: 'demo_35', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_14', target: 'demo_38', weight: 0.4, edge_type: 'vector' as const },
  { source: 'demo_20', target: 'demo_29', weight: 0.45, edge_type: 'vector' as const },
  { source: 'demo_16', target: 'demo_31', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_28', target: 'demo_26', weight: 0.4, edge_type: 'vector' as const },
  { source: 'demo_6', target: 'demo_19', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_10', target: 'demo_25', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_2', target: 'demo_10', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_37', target: 'demo_30', weight: 0.35, edge_type: 'vector' as const },
];

// GraphData 형식으로 변환
export const demoGraphData: GraphData = {
  nodes: demoNodes.map(node => ({
    ...node,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  })),
  edges: demoEdges,
  metadata: {
    total_nodes: demoNodes.length,
    total_edges: demoEdges.length,
    avg_connections_per_node: (demoEdges.length * 2) / demoNodes.length,
  },
};

// 데모용 사전 정의된 질문과 답변
export interface DemoConversation {
  question: string;
  answer: string;
  referencedNodes: ReferencedNode[];
}

export const demoConversations: DemoConversation[] = [
  {
    question: 'AI 관련 자료를 정리해줘',
    answer: `AI/머신러닝 관련 자료를 분석했습니다.

**핵심 주제 8개를 발견했습니다:**

1. **LLM 기초**: GPT-4 아키텍처, 프롬프트 엔지니어링, 벡터 임베딩
2. **실용 기술**: RAG 시스템, Fine-tuning, AI 에이전트 설계
3. **품질 관리**: LLM 평가 지표, Hallucination 방지

특히 RAG 시스템과 벡터 임베딩은 서로 밀접하게 연결되어 있어, 함께 학습하시면 좋을 것 같습니다.`,
    referencedNodes: [
      { id: 'demo_1', title: 'GPT-4 아키텍처', link: '/nodes/demo_1' },
      { id: 'demo_2', title: 'RAG 시스템 구현', link: '/nodes/demo_2' },
      { id: 'demo_4', title: '벡터 임베딩 이해', link: '/nodes/demo_4' },
      { id: 'demo_6', title: 'AI 에이전트 설계', link: '/nodes/demo_6' },
    ],
  },
  {
    question: '웹 개발 트렌드를 요약해줘',
    answer: `최신 웹 개발 트렌드를 정리했습니다.

**주요 기술 동향:**

1. **React 생태계**: React 18의 Concurrent Mode와 Server Components가 핵심
2. **Next.js**: App Router로 패러다임 전환, RSC와 스트리밍 지원
3. **타입 안전성**: TypeScript의 고급 타입 시스템 활용 증가
4. **성능 최적화**: Core Web Vitals 중심의 최적화 전략

React와 Next.js 자료가 강하게 연결되어 있습니다. 함께 살펴보시길 권장합니다.`,
    referencedNodes: [
      { id: 'demo_9', title: 'React 18 신기능', link: '/nodes/demo_9' },
      { id: 'demo_10', title: 'Next.js App Router', link: '/nodes/demo_10' },
      { id: 'demo_11', title: 'TypeScript 타입 시스템', link: '/nodes/demo_11' },
      { id: 'demo_14', title: '웹 성능 최적화', link: '/nodes/demo_14' },
    ],
  },
  {
    question: '생산성을 높이는 방법을 알려줘',
    answer: `생산성 향상 관련 자료를 종합했습니다.

**핵심 전략 3가지:**

1. **집중력 관리**
   - 딥워크 실천으로 깊은 집중 시간 확보
   - 습관 형성을 통한 루틴 구축

2. **지식 관리**
   - 제텔카스텐/코넬 노트 방식의 체계적 정리
   - 마인드맵으로 아이디어 시각화 및 연결
   - 스페이스드 반복으로 장기 기억 강화

3. **업무 방식**
   - 효과적인 회의 운영
   - OKR로 목표 정렬

글쓰기 루틴과 딥워크 자료가 연결되어 있어, 창작 생산성에 관심 있으시면 함께 참고하세요.`,
    referencedNodes: [
      { id: 'demo_29', title: '딥워크 실천', link: '/nodes/demo_29' },
      { id: 'demo_28', title: '효과적인 노트 테이킹', link: '/nodes/demo_28' },
      { id: 'demo_33', title: '습관 형성', link: '/nodes/demo_33' },
      { id: 'demo_24', title: '효과적인 회의', link: '/nodes/demo_24' },
    ],
  },
  {
    question: '데이터 분석 자료를 보여줘',
    answer: `데이터 분석 관련 자료를 정리했습니다.

**학습 경로 제안:**

1. **기초**
   - SQL 쿼리 최적화
   - Python 데이터 분석 (Pandas, NumPy)

2. **시각화**
   - Matplotlib, Seaborn, Plotly 활용법
   - 대시보드 설계 원칙

3. **실무 응용**
   - A/B 테스트 설계와 통계 분석
   - 데이터 파이프라인 구축

ML 파이프라인과 데이터 파이프라인이 연결되어 있어, MLOps에 관심 있으시면 함께 살펴보세요.`,
    referencedNodes: [
      { id: 'demo_35', title: 'Python 데이터 분석', link: '/nodes/demo_35' },
      { id: 'demo_36', title: '데이터 시각화', link: '/nodes/demo_36' },
      { id: 'demo_37', title: 'A/B 테스트 설계', link: '/nodes/demo_37' },
      { id: 'demo_39', title: '데이터 파이프라인', link: '/nodes/demo_39' },
    ],
  },
  {
    question: '글쓰기 관련 자료를 찾아줘',
    answer: `창작 및 글쓰기 관련 자료를 모았습니다.

**체계적인 글쓰기를 위한 자료:**

1. **구조 설계**
   - 스토리텔링 구조 (3막 구조, 영웅의 여정)
   - 세계관 구축 (일관성 있는 설정)

2. **캐릭터와 대화**
   - 캐릭터 아크 설계 (성장과 변화)
   - 대화문 작성법 (자연스러운 목소리)

3. **습관과 완성**
   - 글쓰기 루틴 (꾸준한 습관)
   - 퇴고와 수정 (완성도 높이기)

스토리텔링 구조와 캐릭터 아크가 강하게 연결되어 있습니다.`,
    referencedNodes: [
      { id: 'demo_16', title: '스토리텔링 구조', link: '/nodes/demo_16' },
      { id: 'demo_17', title: '캐릭터 아크 설계', link: '/nodes/demo_17' },
      { id: 'demo_19', title: '세계관 구축', link: '/nodes/demo_19' },
      { id: 'demo_20', title: '글쓰기 루틴', link: '/nodes/demo_20' },
    ],
  },
  {
    question: '팀 협업을 개선하는 방법은?',
    answer: `팀 협업 개선을 위한 자료를 정리했습니다.

**효과적인 협업을 위한 핵심 요소:**

1. **프로세스**
   - 애자일 스크럼 방법론 도입
   - OKR로 팀 목표 정렬

2. **코드 품질**
   - 건설적인 코드 리뷰 문화
   - 기술 문서화 습관

3. **소통**
   - 효과적인 회의 운영
   - 체계적인 온보딩 프로세스

애자일과 코드 리뷰가 연결되어 있어, 개발팀이라면 함께 적용해보세요.`,
    referencedNodes: [
      { id: 'demo_22', title: '애자일 스크럼', link: '/nodes/demo_22' },
      { id: 'demo_25', title: '코드 리뷰 문화', link: '/nodes/demo_25' },
      { id: 'demo_24', title: '효과적인 회의', link: '/nodes/demo_24' },
      { id: 'demo_27', title: '온보딩 프로세스', link: '/nodes/demo_27' },
    ],
  },
];

// 데모용 노드 상세 정보
export const demoNodeDetails: Record<string, {
  id: string;
  summary: string;
  text: string;
  format: 'article' | 'paper' | 'memo' | 'idea';
  created_at: string;
}> = {
  demo_1: {
    id: 'demo_1',
    summary: 'GPT-4의 트랜스포머 아키텍처와 어텐션 메커니즘에 대한 분석',
    text: `GPT-4는 OpenAI에서 개발한 대규모 언어 모델로, 트랜스포머 아키텍처를 기반으로 합니다.

핵심 구성 요소:
1. Self-Attention 메커니즘: 입력 시퀀스의 모든 위치 간 관계를 학습
2. Multi-Head Attention: 여러 관점에서 동시에 어텐션 수행
3. Feed-Forward Networks: 비선형 변환을 통한 표현력 강화
4. Layer Normalization: 학습 안정화

GPT-4는 이전 버전 대비 더 큰 컨텍스트 윈도우와 향상된 추론 능력을 제공합니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_2: {
    id: 'demo_2',
    summary: 'Retrieval-Augmented Generation을 활용한 지식 기반 AI 시스템 구현 방법',
    text: `RAG(Retrieval-Augmented Generation)는 LLM의 한계를 극복하기 위한 아키텍처입니다.

구현 단계:
1. 문서 청킹: 긴 문서를 적절한 크기로 분할
2. 임베딩 생성: 각 청크를 벡터로 변환
3. 벡터 DB 저장: Pinecone, Weaviate 등에 인덱싱
4. 검색: 쿼리와 유사한 문서 검색
5. 생성: 검색된 컨텍스트와 함께 LLM에 전달

LangChain을 활용하면 RAG 파이프라인을 쉽게 구축할 수 있습니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_9: {
    id: 'demo_9',
    summary: 'Concurrent Mode, Suspense, Server Components 등 React 18의 주요 변화',
    text: `React 18은 동시성(Concurrency)을 핵심으로 하는 메이저 업데이트입니다.

주요 기능:
1. Automatic Batching: 여러 상태 업데이트를 자동으로 배치 처리
2. Transitions: 긴급하지 않은 업데이트를 표시하여 UI 응답성 유지
3. Suspense 개선: 서버 사이드 렌더링에서도 사용 가능
4. Server Components: 서버에서 렌더링되는 컴포넌트로 번들 크기 감소

useTransition, useDeferredValue 등 새로운 훅도 추가되었습니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_16: {
    id: 'demo_16',
    summary: '3막 구조, 영웅의 여정 등 이야기 전개의 기본 프레임워크',
    text: `효과적인 스토리텔링을 위한 구조적 접근법입니다.

3막 구조:
- 1막 (설정): 인물, 배경, 갈등 소개
- 2막 (대립): 갈등 심화, 위기와 시련
- 3막 (해결): 클라이맥스와 결말

영웅의 여정 (조셉 캠벨):
1. 일상 세계 → 2. 모험의 소명 → 3. 소명의 거부
4. 조력자와의 만남 → 5. 첫 관문 통과 → 6. 시련, 동료, 적
7. 동굴 가장 깊은 곳 접근 → 8. 시련 → 9. 보상
10. 귀환의 길 → 11. 부활 → 12. 영약을 가지고 귀환`,
    format: 'memo',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_29: {
    id: 'demo_29',
    summary: '깊은 집중을 통한 생산성 향상 전략',
    text: `칼 뉴포트의 딥워크 개념을 실천하기 위한 전략입니다.

핵심 원칙:
1. 깊이 있게 일하라: 인지적으로 까다로운 작업에 방해 없이 집중
2. 지루함을 받아들여라: 항상 자극을 추구하는 습관을 버려라
3. 소셜 미디어를 끊어라: 산만함의 주요 원인 제거
4. 피상적 작업을 줄여라: 회의, 이메일 등 비핵심 작업 최소화

실천 방법:
- 시간 블로킹: 딥워크 시간을 미리 예약
- 의식(ritual): 작업 시작/종료 루틴 만들기
- 다운타임 확보: 휴식이 창의성과 집중력을 회복`,
    format: 'article',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

// 나머지 노드들의 기본 상세 정보 생성
demoNodes.forEach(node => {
  if (!demoNodeDetails[node.id]) {
    demoNodeDetails[node.id] = {
      id: node.id,
      summary: node.summary,
      text: `${node.summary}\n\n키워드: ${node.keywords.join(', ')}\n\n이 자료는 ${node.project} 프로젝트에 속합니다.`,
      format: 'memo',
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
});
