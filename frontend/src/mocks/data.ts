import type { Node, GraphNode, GraphEdge, ClusterInfo, BridgeNode, ActivityLogEntry } from '@/types';

// 샘플 노드 데이터 (30개)
export const mockNodes: Node[] = [
  // 클러스터 1: AI/ML (8개)
  {
    id: 'node_001',
    summary: 'GPT-4의 멀티모달 기능과 활용 사례',
    text: 'GPT-4는 텍스트뿐 아니라 이미지도 이해할 수 있는 멀티모달 AI 모델이다. 이미지 분석, 차트 해석, UI 디자인 피드백 등 다양한 활용 사례가 있다.',
    format: 'article',
    context: 'OpenAI 블로그에서',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'node_002',
    summary: 'LLM 프롬프트 엔지니어링 베스트 프랙티스',
    text: '효과적인 프롬프트 작성법: 명확한 지시, 예시 제공, 단계별 사고 유도, 역할 부여 등의 기법을 통해 LLM의 출력 품질을 높일 수 있다.',
    format: 'memo',
    context: '업무 중 정리',
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
  },
  {
    id: 'node_003',
    summary: 'RAG(Retrieval-Augmented Generation) 아키텍처 분석',
    text: '검색 증강 생성은 외부 지식 베이스를 활용하여 LLM의 답변 정확도를 높이는 기법이다. 벡터 DB와 임베딩을 결합하여 관련 문서를 검색하고 컨텍스트로 제공한다.',
    format: 'paper',
    context: 'arXiv 논문',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: 'node_004',
    summary: 'AI 에이전트와 Tool Use 패턴',
    text: 'AI 에이전트는 단순 대화를 넘어 도구를 사용하여 실제 작업을 수행할 수 있다. 웹 검색, 코드 실행, API 호출 등을 통해 복잡한 태스크를 자동화한다.',
    format: 'article',
    context: 'Anthropic 문서',
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
  },
  {
    id: 'node_005',
    summary: '벡터 임베딩과 시맨틱 검색의 원리',
    text: '텍스트를 고차원 벡터로 변환하면 의미적 유사성을 수학적으로 계산할 수 있다. 코사인 유사도를 통해 관련 문서를 찾는 시맨틱 검색이 가능해진다.',
    format: 'paper',
    context: '기술 블로그',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'node_006',
    summary: 'Fine-tuning vs Few-shot Learning 비교',
    text: '모델 커스터마이징 방법 비교: Fine-tuning은 도메인 특화에 효과적이나 비용이 높고, Few-shot은 빠르게 적용 가능하나 복잡한 태스크에는 한계가 있다.',
    format: 'memo',
    context: '프로젝트 검토 중',
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: 'node_007',
    summary: 'AI 윤리와 편향성 문제',
    text: 'AI 모델의 학습 데이터에 내재된 편향은 출력에도 반영된다. 공정성, 투명성, 책임성을 고려한 AI 개발이 필요하다.',
    format: 'article',
    context: 'MIT Tech Review',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'node_008',
    summary: 'Transformer 아키텍처의 핵심: Attention 메커니즘',
    text: 'Self-attention은 입력 시퀀스의 모든 위치 간 관계를 동시에 계산한다. 이를 통해 장거리 의존성을 효과적으로 포착할 수 있다.',
    format: 'paper',
    context: 'Attention is All You Need 논문',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },

  // 클러스터 2: 지식 관리 (7개)
  {
    id: 'node_009',
    summary: '제텔카스텐 방법론의 현대적 적용',
    text: '니클라스 루만의 제텔카스텐을 디지털 도구로 구현하는 방법. 원자적 노트, 양방향 링크, 고유 ID의 원칙을 Obsidian이나 Roam에 적용한다.',
    format: 'article',
    context: '생산성 블로그',
    created_at: new Date(Date.now() - 86400000 * 29).toISOString(),
  },
  {
    id: 'node_010',
    summary: 'PARA 방법론으로 정보 체계화하기',
    text: 'Projects, Areas, Resources, Archives로 모든 정보를 분류하는 Tiago Forte의 방법론. 실행 가능성을 기준으로 정보를 정리한다.',
    format: 'article',
    context: 'Building a Second Brain',
    created_at: new Date(Date.now() - 86400000 * 27).toISOString(),
  },
  {
    id: 'node_011',
    summary: 'Evergreen Notes 작성 원칙',
    text: '상록수 노트는 시간이 지나도 가치가 유지되는 노트다. 자신의 언어로 작성하고, 밀도 있게 연결하며, 점진적으로 발전시킨다.',
    format: 'memo',
    context: 'Andy Matuschak 블로그',
    created_at: new Date(Date.now() - 86400000 * 24).toISOString(),
  },
  {
    id: 'node_012',
    summary: '노트 연결이 창의성을 높이는 이유',
    text: '서로 관련 없어 보이는 아이디어를 연결할 때 새로운 통찰이 생긴다. 지식 그래프는 이런 예상치 못한 연결을 발견하게 해준다.',
    format: 'idea',
    context: '독서 중 영감',
    created_at: new Date(Date.now() - 86400000 * 21).toISOString(),
  },
  {
    id: 'node_013',
    summary: 'Progressive Summarization 기법',
    text: '정보를 층층이 요약하는 기법. 1차 강조, 2차 강조, 3차 요약을 통해 핵심만 빠르게 파악할 수 있도록 한다.',
    format: 'memo',
    context: 'Tiago Forte 강의',
    created_at: new Date(Date.now() - 86400000 * 17).toISOString(),
  },
  {
    id: 'node_014',
    summary: 'Digital Garden: 공개적 학습의 힘',
    text: '완성된 글이 아닌 성장하는 노트를 공개하는 개념. 학습 과정을 공유하고 피드백을 받으며 함께 성장한다.',
    format: 'article',
    context: 'Maggie Appleton',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'node_015',
    summary: '메타인지와 지식 관리의 관계',
    text: '자신이 무엇을 알고 모르는지 파악하는 메타인지 능력이 효과적인 지식 관리의 핵심이다. 주기적 복습과 연결이 이를 강화한다.',
    format: 'idea',
    context: '심리학 책에서',
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
  },

  // 클러스터 3: 글쓰기/콘텐츠 (6개)
  {
    id: 'node_016',
    summary: '좋은 글의 구조: 서론-본론-결론의 재해석',
    text: '전통적 구조를 넘어서 독자의 관심을 끄는 Hook, 가치를 전달하는 Body, 행동을 유도하는 CTA로 구성한다.',
    format: 'memo',
    context: '글쓰기 워크숍',
    created_at: new Date(Date.now() - 86400000 * 26).toISOString(),
  },
  {
    id: 'node_017',
    summary: '스토리텔링의 과학적 효과',
    text: '이야기는 뇌의 여러 영역을 동시에 활성화시킨다. 데이터보다 스토리가 기억에 더 오래 남고 행동 변화를 유도한다.',
    format: 'article',
    context: 'HBR 아티클',
    created_at: new Date(Date.now() - 86400000 * 23).toISOString(),
  },
  {
    id: 'node_018',
    summary: '매일 글쓰기의 복리 효과',
    text: '매일 조금씩 글을 쓰면 실력이 복리로 성장한다. 완벽함보다 꾸준함이 중요하며, 나중에 편집하면 된다.',
    format: 'idea',
    context: '개인 경험',
    created_at: new Date(Date.now() - 86400000 * 19).toISOString(),
  },
  {
    id: 'node_019',
    summary: 'SEO 친화적 콘텐츠 작성법',
    text: '검색 엔진 최적화를 고려한 글쓰기. 키워드 연구, 헤딩 구조화, 메타 설명 작성, 내부 링크 등의 기법을 활용한다.',
    format: 'article',
    context: 'Moz 블로그',
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
  },
  {
    id: 'node_020',
    summary: '뉴스레터 성장 전략',
    text: '구독자를 늘리고 유지하는 방법. 일관된 발행 주기, 명확한 가치 제안, 커뮤니티 형성이 핵심이다.',
    format: 'memo',
    context: 'Substack 가이드',
    created_at: new Date(Date.now() - 86400000 * 13).toISOString(),
  },
  {
    id: 'node_021',
    summary: '정보 과부하 시대의 큐레이션',
    text: '넘치는 정보 속에서 가치를 선별하고 맥락을 더하는 큐레이션이 중요해졌다. 단순 공유가 아닌 해석과 의견이 필요하다.',
    format: 'article',
    context: 'Medium',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },

  // 클러스터 4: 생산성/습관 (5개)
  {
    id: 'node_022',
    summary: '딥워크: 깊은 집중의 기술',
    text: 'Cal Newport의 딥워크 개념. 방해 없는 집중 시간을 확보하여 인지적으로 까다로운 작업을 수행한다.',
    format: 'article',
    context: 'Deep Work 책',
    created_at: new Date(Date.now() - 86400000 * 28).toISOString(),
  },
  {
    id: 'node_023',
    summary: '타임 블로킹으로 일정 관리하기',
    text: '할 일 목록 대신 캘린더에 작업 시간을 미리 블로킹한다. 의도적으로 시간을 배분하여 중요한 일에 집중한다.',
    format: 'memo',
    context: '생산성 실험',
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
  },
  {
    id: 'node_024',
    summary: '습관 스태킹: 기존 습관에 새 습관 연결하기',
    text: 'James Clear의 습관 스태킹 기법. 이미 자리잡은 습관 뒤에 새로운 습관을 연결하여 실행 가능성을 높인다.',
    format: 'article',
    context: 'Atomic Habits',
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: 'node_025',
    summary: '포모도로 테크닉의 변형과 적용',
    text: '25분 집중 + 5분 휴식의 기본 구조를 자신에게 맞게 변형한다. 52-17, 90분 블록 등 다양한 변형이 있다.',
    format: 'memo',
    context: '개인 실험',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'node_026',
    summary: '에너지 관리가 시간 관리보다 중요한 이유',
    text: '같은 시간이라도 에너지 수준에 따라 생산성이 달라진다. 고에너지 시간에 중요한 일을, 저에너지 시간에 루틴 작업을 배치한다.',
    format: 'idea',
    context: 'The Power of Full Engagement',
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  },

  // 클러스터 5: 디자인/UX (4개)
  {
    id: 'node_027',
    summary: '사용자 중심 디자인의 원칙',
    text: 'Don Norman의 디자인 원칙: 가시성, 피드백, 제약, 일관성, 행동 유도성. 사용자의 멘탈 모델에 맞는 디자인이 직관적이다.',
    format: 'article',
    context: 'The Design of Everyday Things',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: 'node_028',
    summary: '피그마 컴포넌트 시스템 설계',
    text: '재사용 가능한 UI 컴포넌트를 설계하는 방법. Variants, Auto Layout, 토큰 시스템을 활용한 확장 가능한 디자인 시스템.',
    format: 'memo',
    context: '프로젝트 경험',
    created_at: new Date(Date.now() - 86400000 * 19).toISOString(),
  },
  {
    id: 'node_029',
    summary: '접근성(a11y)을 고려한 디자인',
    text: '모든 사용자가 이용할 수 있는 디자인. 색상 대비, 키보드 네비게이션, 스크린 리더 호환성 등을 고려한다.',
    format: 'article',
    context: 'W3C 가이드라인',
    created_at: new Date(Date.now() - 86400000 * 13).toISOString(),
  },
  {
    id: 'node_030',
    summary: '마이크로인터랙션의 심리학',
    text: '작은 애니메이션과 피드백이 사용자 경험을 크게 향상시킨다. 로딩, 전환, 알림 등에서 디테일이 차이를 만든다.',
    format: 'idea',
    context: 'UX 컨퍼런스',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

// 그래프 노드 생성
export const mockGraphNodes: GraphNode[] = mockNodes.map((node, index) => ({
  id: node.id,
  label: node.summary,
  format: node.format,
  summary: node.summary,
  x: 200 + Math.cos((index / mockNodes.length) * 2 * Math.PI) * 250,
  y: 250 + Math.sin((index / mockNodes.length) * 2 * Math.PI) * 200,
}));

// 그래프 엣지 생성 (클러스터 내 강한 연결 + 클러스터 간 약한 연결)
export const mockGraphEdges: GraphEdge[] = [
  // 클러스터 1: AI/ML 내부 연결 (강한) - 핵심 연결만
  { source: 'node_001', target: 'node_002', weight: 0.85 },
  { source: 'node_002', target: 'node_003', weight: 0.82 },
  { source: 'node_003', target: 'node_005', weight: 0.88 },
  { source: 'node_004', target: 'node_005', weight: 0.75 },
  { source: 'node_006', target: 'node_008', weight: 0.78 },
  { source: 'node_007', target: 'node_001', weight: 0.65 },

  // 클러스터 2: 지식 관리 내부 연결 (강한)
  { source: 'node_009', target: 'node_010', weight: 0.90 },
  { source: 'node_010', target: 'node_013', weight: 0.82 },
  { source: 'node_011', target: 'node_012', weight: 0.88 },
  { source: 'node_013', target: 'node_015', weight: 0.70 },
  { source: 'node_014', target: 'node_011', weight: 0.78 },

  // 클러스터 3: 글쓰기 내부 연결 (강한)
  { source: 'node_016', target: 'node_017', weight: 0.85 },
  { source: 'node_017', target: 'node_018', weight: 0.75 },
  { source: 'node_019', target: 'node_020', weight: 0.78 },
  { source: 'node_020', target: 'node_021', weight: 0.82 },

  // 클러스터 4: 생산성 내부 연결 (강한)
  { source: 'node_022', target: 'node_023', weight: 0.88 },
  { source: 'node_024', target: 'node_025', weight: 0.80 },
  { source: 'node_025', target: 'node_026', weight: 0.72 },

  // 클러스터 5: 디자인 내부 연결 (강한)
  { source: 'node_027', target: 'node_028', weight: 0.85 },
  { source: 'node_029', target: 'node_030', weight: 0.75 },
];

// 클러스터 정보
export const mockClusters: ClusterInfo[] = [
  {
    cluster_id: 0,
    theme: 'AI/ML 기술과 응용',
    node_ids: ['node_001', 'node_002', 'node_003', 'node_004', 'node_005', 'node_006', 'node_007', 'node_008'],
    node_summaries: [
      'GPT-4의 멀티모달 기능',
      'LLM 프롬프트 엔지니어링',
      'RAG 아키텍처',
      'AI 에이전트와 Tool Use',
      '벡터 임베딩과 시맨틱 검색',
      'Fine-tuning vs Few-shot',
      'AI 윤리와 편향성',
      'Transformer와 Attention',
    ],
  },
  {
    cluster_id: 1,
    theme: '지식 관리 방법론',
    node_ids: ['node_009', 'node_010', 'node_011', 'node_012', 'node_013', 'node_014', 'node_015'],
    node_summaries: [
      '제텔카스텐 방법론',
      'PARA 방법론',
      'Evergreen Notes',
      '노트 연결과 창의성',
      'Progressive Summarization',
      'Digital Garden',
      '메타인지와 지식 관리',
    ],
  },
  {
    cluster_id: 2,
    theme: '글쓰기와 콘텐츠',
    node_ids: ['node_016', 'node_017', 'node_018', 'node_019', 'node_020', 'node_021'],
    node_summaries: [
      '좋은 글의 구조',
      '스토리텔링의 효과',
      '매일 글쓰기',
      'SEO 콘텐츠 작성',
      '뉴스레터 성장',
      '정보 큐레이션',
    ],
  },
  {
    cluster_id: 3,
    theme: '생산성과 습관',
    node_ids: ['node_022', 'node_023', 'node_024', 'node_025', 'node_026'],
    node_summaries: [
      '딥워크',
      '타임 블로킹',
      '습관 스태킹',
      '포모도로 테크닉',
      '에너지 관리',
    ],
  },
  {
    cluster_id: 4,
    theme: '디자인과 UX',
    node_ids: ['node_027', 'node_028', 'node_029', 'node_030'],
    node_summaries: [
      '사용자 중심 디자인',
      '피그마 컴포넌트',
      '접근성 디자인',
      '마이크로인터랙션',
    ],
  },
];

// 브리지 노드 (클러스터 간 연결점)
export const mockBridges: BridgeNode[] = [
  {
    id: 'node_003',
    summary: 'RAG(Retrieval-Augmented Generation) 아키텍처 분석',
    connected_clusters: [0, 1],
    bridge_score: 0.72,
  },
  {
    id: 'node_011',
    summary: 'Evergreen Notes 작성 원칙',
    connected_clusters: [1, 2],
    bridge_score: 0.65,
  },
  {
    id: 'node_018',
    summary: '매일 글쓰기의 복리 효과',
    connected_clusters: [2, 3],
    bridge_score: 0.58,
  },
  {
    id: 'node_027',
    summary: '사용자 중심 디자인의 원칙',
    connected_clusters: [0, 4],
    bridge_score: 0.55,
  },
];

// 세션 로그
export let mockSessionLogs: ActivityLogEntry[] = [];

// 로컬 스토리지 키
const STORAGE_KEY = 'nova_nodes';
const LOGS_KEY = 'nova_logs';

// 노드 데이터 로드/저장
export function loadNodes(): Node[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // 기존 데이터가 7개 이하면 새 목데이터로 교체
      if (parsed.length <= 7) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNodes));
        return mockNodes;
      }
      return parsed;
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNodes));
      return mockNodes;
    }
  }
  // 초기 Mock 데이터 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNodes));
  return mockNodes;
}

export function saveNodes(nodes: Node[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

// 로그 데이터 로드/저장
export function loadLogs(sessionId: string): ActivityLogEntry[] {
  const stored = localStorage.getItem(`${LOGS_KEY}_${sessionId}`);
  return stored ? JSON.parse(stored) : [];
}

export function saveLogs(sessionId: string, logs: ActivityLogEntry[]): void {
  localStorage.setItem(`${LOGS_KEY}_${sessionId}`, JSON.stringify(logs));
}
