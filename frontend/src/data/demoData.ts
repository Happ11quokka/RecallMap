import type { GraphData, ReferencedNode } from '@/types';

// 클러스터 ID 매핑 (노드별 클러스터 지정)
export const nodeClusterMap: Record<string, number> = {
  // 클러스터 0: 한국 현대시 (10개)
  demo_1: 0, demo_2: 0, demo_3: 0, demo_4: 0, demo_5: 0, demo_6: 0, demo_7: 0, demo_8: 0, demo_41: 0, demo_42: 0,
  // 클러스터 1: 한국 현대소설 (10개)
  demo_9: 1, demo_10: 1, demo_11: 1, demo_12: 1, demo_13: 1, demo_14: 1, demo_15: 1, demo_43: 1, demo_44: 1, demo_45: 1,
  // 클러스터 2: 고전문학 (10개)
  demo_16: 2, demo_17: 2, demo_18: 2, demo_19: 2, demo_20: 2, demo_21: 2, demo_46: 2, demo_47: 2, demo_48: 2, demo_49: 2,
  // 클러스터 3: 문학비평/이론 (10개)
  demo_22: 3, demo_23: 3, demo_24: 3, demo_25: 3, demo_26: 3, demo_27: 3, demo_50: 3, demo_51: 3, demo_52: 3, demo_53: 3,
  // 클러스터 4: 세계문학 (10개)
  demo_28: 4, demo_29: 4, demo_30: 4, demo_31: 4, demo_32: 4, demo_33: 4, demo_54: 4, demo_55: 4, demo_56: 4, demo_57: 4,
  // 클러스터 5: 인문학/철학 (10개)
  demo_34: 5, demo_35: 5, demo_36: 5, demo_37: 5, demo_38: 5, demo_39: 5, demo_40: 5, demo_58: 5, demo_59: 5, demo_60: 5,
};

// 데모용 60개 노드 데이터 - 인문학/한국 현대문학 테마
export const demoNodes = [
  // 클러스터 0: 한국 현대시 (10개)
  { id: 'demo_1', label: '윤동주의 서시', summary: '"죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를" - 저항시인의 순수한 영혼', keywords: ['윤동주', '서시', '저항시', '순수'], project: 'literature' },
  { id: 'demo_2', label: '김소월의 진달래꽃', summary: '이별의 정한, 한국인의 보편적 감성을 담은 민요적 서정시', keywords: ['김소월', '진달래꽃', '민요시', '이별'], project: 'literature' },
  { id: 'demo_3', label: '정지용의 향수', summary: '선명한 이미지와 음악적 리듬으로 그린 고향에 대한 그리움', keywords: ['정지용', '향수', '이미지즘', '고향'], project: 'literature' },
  { id: 'demo_4', label: '백석의 나와 나타샤', summary: '토속적 언어와 가난한 사랑을 노래한 북방 정서', keywords: ['백석', '나타샤', '토속어', '북방'], project: 'literature' },
  { id: 'demo_5', label: '한용운의 님의 침묵', summary: '님의 부재를 통해 역설적으로 님을 노래한 저항과 사랑의 시', keywords: ['한용운', '님의침묵', '저항', '불교'], project: 'literature' },
  { id: 'demo_6', label: '서정주의 국화 옆에서', summary: '동양적 명상과 삶의 원숙함을 노래한 서정시', keywords: ['서정주', '국화', '서정', '명상'], project: 'literature' },
  { id: 'demo_7', label: '이육사의 광야', summary: '일제강점기 암흑 속에서 빛나는 저항정신과 희망의 노래', keywords: ['이육사', '광야', '저항시', '희망'], project: 'literature' },
  { id: 'demo_8', label: '김수영의 풀', summary: '4.19 이후 민주주의를 향한 열망과 생명력을 담은 참여시', keywords: ['김수영', '풀', '참여시', '민주주의'], project: 'literature' },
  { id: 'demo_41', label: '신동엽의 껍데기는 가라', summary: '4.19 혁명 정신을 노래한 민중시인의 대표작', keywords: ['신동엽', '민중시', '혁명', '저항'], project: 'literature' },
  { id: 'demo_42', label: '기형도의 빈집', summary: '죽음과 부재의 시학, 1980년대 암울한 시대 정서', keywords: ['기형도', '빈집', '죽음', '부재'], project: 'literature' },

  // 클러스터 1: 한국 현대소설 (10개)
  { id: 'demo_9', label: '한강의 채식주의자', summary: '폭력적 세계에 대한 거부, 식물이 되고자 하는 여성의 이야기', keywords: ['한강', '채식주의자', '맨부커상', '폭력'], project: 'literature' },
  { id: 'demo_10', label: '황석영의 객지', summary: '산업화 시대 노동자의 삶과 소외를 그린 리얼리즘 소설', keywords: ['황석영', '객지', '노동문학', '리얼리즘'], project: 'literature' },
  { id: 'demo_11', label: '박완서의 나목', summary: '6.25 전쟁의 상처와 생존, 예술가의 삶을 그린 자전적 소설', keywords: ['박완서', '나목', '전쟁', '여성'], project: 'literature' },
  { id: 'demo_12', label: '조세희의 난장이가 쏘아올린 작은 공', summary: '산업화의 그늘, 소외된 자들의 아픔을 담은 연작소설', keywords: ['조세희', '난장이', '산업화', '소외'], project: 'literature' },
  { id: 'demo_13', label: '이청준의 당신들의 천국', summary: '소록도를 배경으로 한 권력과 이상사회에 대한 우화', keywords: ['이청준', '당신들의천국', '권력', '우화'], project: 'literature' },
  { id: 'demo_14', label: '최인훈의 광장', summary: '분단 현실 속 이데올로기의 허상과 개인의 실존을 탐구', keywords: ['최인훈', '광장', '분단', '실존'], project: 'literature' },
  { id: 'demo_15', label: '김승옥의 무진기행', summary: '현대인의 고독과 일상으로부터의 탈출을 그린 감각적 소설', keywords: ['김승옥', '무진기행', '고독', '감각'], project: 'literature' },
  { id: 'demo_43', label: '이문열의 우리들의 일그러진 영웅', summary: '권력의 본질과 순응의 문제를 다룬 알레고리 소설', keywords: ['이문열', '권력', '알레고리', '교실'], project: 'literature' },
  { id: 'demo_44', label: '신경숙의 엄마를 부탁해', summary: '잃어버린 어머니를 통해 가족의 의미를 성찰하는 이야기', keywords: ['신경숙', '어머니', '가족', '상실'], project: 'literature' },
  { id: 'demo_45', label: '정유정의 종의 기원', summary: '괴물은 태어나는가 만들어지는가, 심리 스릴러의 걸작', keywords: ['정유정', '스릴러', '심리', '괴물'], project: 'literature' },

  // 클러스터 2: 고전문학 (10개)
  { id: 'demo_16', label: '춘향전', summary: '신분을 초월한 사랑과 절개, 한국 고전소설의 대표작', keywords: ['춘향전', '판소리', '사랑', '절개'], project: 'literature' },
  { id: 'demo_17', label: '홍길동전', summary: '허균이 쓴 최초의 한글소설, 신분제에 대한 저항', keywords: ['홍길동전', '허균', '신분제', '이상사회'], project: 'literature' },
  { id: 'demo_18', label: '구운몽', summary: '불교적 세계관을 바탕으로 한 인생무상과 깨달음의 서사', keywords: ['구운몽', '김만중', '불교', '꿈'], project: 'literature' },
  { id: 'demo_19', label: '심청전', summary: '효녀 심청의 희생과 보은, 한국적 효 사상의 결정체', keywords: ['심청전', '효', '판소리', '희생'], project: 'literature' },
  { id: 'demo_20', label: '흥부전', summary: '형제간의 우애와 권선징악, 민중의 꿈을 담은 이야기', keywords: ['흥부전', '판소리', '권선징악', '민중'], project: 'literature' },
  { id: 'demo_21', label: '토끼전', summary: '용궁에 간 토끼의 지략, 풍자와 해학이 넘치는 우화소설', keywords: ['토끼전', '우화', '풍자', '해학'], project: 'literature' },
  { id: 'demo_46', label: '사씨남정기', summary: '가문 내 갈등과 여성의 고난을 그린 가정소설', keywords: ['사씨남정기', '김만중', '가정소설', '여성'], project: 'literature' },
  { id: 'demo_47', label: '금오신화', summary: '김시습의 환상적 단편집, 한국 최초의 소설로 평가', keywords: ['금오신화', '김시습', '환상', '단편'], project: 'literature' },
  { id: 'demo_48', label: '박씨전', summary: '병자호란을 배경으로 한 영웅적 여성 이야기', keywords: ['박씨전', '병자호란', '여성영웅', '역사'], project: 'literature' },
  { id: 'demo_49', label: '숙향전', summary: '천상에서 적강한 여인의 고난과 재회 이야기', keywords: ['숙향전', '적강', '고난', '사랑'], project: 'literature' },

  // 클러스터 3: 문학비평/이론 (10개)
  { id: 'demo_22', label: '김현의 문학사회학', summary: '문학과 사회의 관계를 탐구한 비평적 시각', keywords: ['김현', '문학사회학', '비평', '사회'], project: 'theory' },
  { id: 'demo_23', label: '백낙청의 민족문학론', summary: '분단시대의 문학적 과제와 민족문학의 방향 제시', keywords: ['백낙청', '민족문학', '분단', '리얼리즘'], project: 'theory' },
  { id: 'demo_24', label: '서정시의 이론', summary: '서정시의 본질과 형식, 언어적 특성에 대한 연구', keywords: ['서정시', '시학', '언어', '형식'], project: 'theory' },
  { id: 'demo_25', label: '한국 근대소설의 형성', summary: '개화기부터 일제강점기까지 한국 소설의 발전 과정', keywords: ['근대소설', '개화기', '형성', '발전'], project: 'theory' },
  { id: 'demo_26', label: '문학과 이데올로기', summary: '문학 텍스트 속에 작동하는 이데올로기적 무의식 분석', keywords: ['이데올로기', '무의식', '텍스트', '분석'], project: 'theory' },
  { id: 'demo_27', label: '탈식민주의 문학비평', summary: '식민지 경험과 문학, 그리고 탈식민적 주체성 탐구', keywords: ['탈식민주의', '식민지', '주체성', '비평'], project: 'theory' },
  { id: 'demo_50', label: '여성주의 문학비평', summary: '젠더 관점에서 문학 텍스트를 재해석하는 비평 이론', keywords: ['페미니즘', '젠더', '여성', '비평'], project: 'theory' },
  { id: 'demo_51', label: '서사학 입문', summary: '이야기의 구조와 서술 방식에 대한 체계적 연구', keywords: ['서사학', '내러티브', '구조', '서술'], project: 'theory' },
  { id: 'demo_52', label: '독자반응비평', summary: '텍스트와 독자의 상호작용에 주목하는 비평 방법론', keywords: ['독자반응', '수용미학', '독서', '해석'], project: 'theory' },
  { id: 'demo_53', label: '생태비평', summary: '문학과 환경의 관계를 탐구하는 새로운 비평 패러다임', keywords: ['생태비평', '환경', '자연', '생태학'], project: 'theory' },

  // 클러스터 4: 세계문학 (10개)
  { id: 'demo_28', label: '카프카의 변신', summary: '어느 날 벌레로 변해버린 남자, 실존적 소외의 우화', keywords: ['카프카', '변신', '실존', '소외'], project: 'literature' },
  { id: 'demo_29', label: '도스토예프스키의 죄와 벌', summary: '살인자의 내면 탐구, 죄의식과 구원에 대한 심리소설', keywords: ['도스토예프스키', '죄와벌', '심리', '구원'], project: 'literature' },
  { id: 'demo_30', label: '가브리엘 마르케스의 백년의 고독', summary: '부엔디아 가문의 100년, 마술적 리얼리즘의 정점', keywords: ['마르케스', '백년의고독', '마술적리얼리즘', '라틴아메리카'], project: 'literature' },
  { id: 'demo_31', label: '버지니아 울프의 댈러웨이 부인', summary: '의식의 흐름 기법으로 그린 하루, 삶과 죽음의 명상', keywords: ['버지니아울프', '의식의흐름', '모더니즘', '여성'], project: 'literature' },
  { id: 'demo_32', label: '알베르 카뮈의 이방인', summary: '태양 때문에 저지른 살인, 부조리한 세계 속 인간', keywords: ['카뮈', '이방인', '부조리', '실존주의'], project: 'literature' },
  { id: 'demo_33', label: '헤르만 헤세의 데미안', summary: '자아를 찾아가는 싱클레어의 성장, 내면의 세계 탐구', keywords: ['헤세', '데미안', '성장', '자아'], project: 'literature' },
  { id: 'demo_54', label: '제임스 조이스의 율리시스', summary: '더블린의 하루를 그린 모더니즘 문학의 기념비적 작품', keywords: ['조이스', '율리시스', '모더니즘', '더블린'], project: 'literature' },
  { id: 'demo_55', label: '프루스트의 잃어버린 시간을 찾아서', summary: '기억과 시간에 대한 방대한 성찰, 프랑스 문학의 정수', keywords: ['프루스트', '시간', '기억', '프랑스'], project: 'literature' },
  { id: 'demo_56', label: '톨스토이의 안나 카레니나', summary: '불륜과 사회의 위선, 러시아 귀족 사회의 비극', keywords: ['톨스토이', '안나카레니나', '러시아', '비극'], project: 'literature' },
  { id: 'demo_57', label: '무라카미 하루키의 노르웨이의 숲', summary: '상실과 사랑, 현대 일본의 청춘 이야기', keywords: ['무라카미', '상실', '청춘', '일본'], project: 'literature' },

  // 클러스터 5: 인문학/철학 (10개)
  { id: 'demo_34', label: '니체의 차라투스트라', summary: '신은 죽었다 선언 이후, 초인과 영원회귀의 철학', keywords: ['니체', '차라투스트라', '초인', '영원회귀'], project: 'philosophy' },
  { id: 'demo_35', label: '사르트르의 실존주의', summary: '실존은 본질에 앞선다, 자유와 책임의 철학', keywords: ['사르트르', '실존주의', '자유', '책임'], project: 'philosophy' },
  { id: 'demo_36', label: '푸코의 권력 이론', summary: '규율권력과 생명권력, 근대 사회의 지식-권력 분석', keywords: ['푸코', '권력', '규율', '담론'], project: 'philosophy' },
  { id: 'demo_37', label: '동양 사상과 문학', summary: '유불선 사상이 동아시아 문학에 미친 영향 연구', keywords: ['동양사상', '유교', '불교', '도교'], project: 'philosophy' },
  { id: 'demo_38', label: '해석학과 문학', summary: '텍스트 이해의 방법론, 가다머와 리쾨르의 해석 이론', keywords: ['해석학', '가다머', '리쾨르', '텍스트'], project: 'philosophy' },
  { id: 'demo_39', label: '미학의 기초', summary: '예술과 아름다움의 본질, 미적 경험에 대한 탐구', keywords: ['미학', '예술', '아름다움', '경험'], project: 'philosophy' },
  { id: 'demo_40', label: '한국 철학사', summary: '조선 성리학에서 현대 철학까지 한국 사상의 흐름', keywords: ['한국철학', '성리학', '실학', '현대'], project: 'philosophy' },
  { id: 'demo_58', label: '하이데거의 존재와 시간', summary: '존재의 의미를 묻는 현상학적 분석, 현대 철학의 이정표', keywords: ['하이데거', '존재', '시간', '현상학'], project: 'philosophy' },
  { id: 'demo_59', label: '들뢰즈의 차이와 반복', summary: '동일성 철학을 넘어서는 차이의 존재론', keywords: ['들뢰즈', '차이', '반복', '존재론'], project: 'philosophy' },
  { id: 'demo_60', label: '데리다의 해체주의', summary: '텍스트의 의미 불확정성과 로고스중심주의 비판', keywords: ['데리다', '해체', '텍스트', '차연'], project: 'philosophy' },
];

// 엣지 데이터 - 이미지처럼 네트워크 느낌의 많은 연결
export const demoEdges = [
  // 클러스터 0: 한국 현대시 내부 연결
  { source: 'demo_1', target: 'demo_2', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_2', target: 'demo_4', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_3', target: 'demo_5', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_4', target: 'demo_6', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_5', target: 'demo_7', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_6', target: 'demo_8', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_1', target: 'demo_7', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_3', target: 'demo_41', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_8', target: 'demo_41', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_41', target: 'demo_42', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_42', target: 'demo_1', weight: 0.5, edge_type: 'vector' as const },

  // 클러스터 1: 한국 현대소설 내부 연결
  { source: 'demo_9', target: 'demo_10', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_10', target: 'demo_11', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_11', target: 'demo_12', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_12', target: 'demo_14', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_13', target: 'demo_15', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_9', target: 'demo_44', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_43', target: 'demo_13', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_44', target: 'demo_11', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_45', target: 'demo_15', weight: 0.5, edge_type: 'vector' as const },
  { source: 'demo_43', target: 'demo_45', weight: 0.55, edge_type: 'vector' as const },

  // 클러스터 2: 고전문학 내부 연결
  { source: 'demo_16', target: 'demo_17', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_17', target: 'demo_18', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_18', target: 'demo_19', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_19', target: 'demo_20', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_20', target: 'demo_21', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_16', target: 'demo_46', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_46', target: 'demo_18', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_47', target: 'demo_48', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_48', target: 'demo_49', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_49', target: 'demo_16', weight: 0.5, edge_type: 'vector' as const },
  { source: 'demo_47', target: 'demo_17', weight: 0.6, edge_type: 'vector' as const },

  // 클러스터 3: 문학비평/이론 내부 연결
  { source: 'demo_22', target: 'demo_23', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_23', target: 'demo_24', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_24', target: 'demo_25', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_25', target: 'demo_26', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_26', target: 'demo_27', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_50', target: 'demo_27', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_51', target: 'demo_24', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_52', target: 'demo_51', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_53', target: 'demo_50', weight: 0.5, edge_type: 'vector' as const },
  { source: 'demo_22', target: 'demo_52', weight: 0.55, edge_type: 'vector' as const },

  // 클러스터 4: 세계문학 내부 연결
  { source: 'demo_28', target: 'demo_29', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_29', target: 'demo_30', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_30', target: 'demo_31', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_31', target: 'demo_32', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_32', target: 'demo_33', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_54', target: 'demo_31', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_55', target: 'demo_54', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_56', target: 'demo_29', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_57', target: 'demo_33', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_55', target: 'demo_30', weight: 0.5, edge_type: 'vector' as const },

  // 클러스터 5: 인문학/철학 내부 연결
  { source: 'demo_34', target: 'demo_35', weight: 0.8, edge_type: 'vector' as const },
  { source: 'demo_35', target: 'demo_36', weight: 0.75, edge_type: 'vector' as const },
  { source: 'demo_36', target: 'demo_37', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_37', target: 'demo_38', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_38', target: 'demo_39', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_39', target: 'demo_40', weight: 0.7, edge_type: 'vector' as const },
  { source: 'demo_58', target: 'demo_34', weight: 0.65, edge_type: 'vector' as const },
  { source: 'demo_59', target: 'demo_58', weight: 0.6, edge_type: 'vector' as const },
  { source: 'demo_60', target: 'demo_59', weight: 0.55, edge_type: 'vector' as const },
  { source: 'demo_60', target: 'demo_38', weight: 0.5, edge_type: 'vector' as const },
  { source: 'demo_58', target: 'demo_35', weight: 0.55, edge_type: 'vector' as const },

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
  // 추가 클러스터 간 연결
  { source: 'demo_41', target: 'demo_23', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_42', target: 'demo_32', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_43', target: 'demo_26', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_44', target: 'demo_50', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_47', target: 'demo_37', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_48', target: 'demo_11', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_51', target: 'demo_54', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_53', target: 'demo_57', weight: 0.3, edge_type: 'vector' as const },
  { source: 'demo_58', target: 'demo_32', weight: 0.4, edge_type: 'vector' as const },
  { source: 'demo_59', target: 'demo_27', weight: 0.35, edge_type: 'vector' as const },
  { source: 'demo_60', target: 'demo_52', weight: 0.4, edge_type: 'vector' as const },
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
    question: '한국 시 자료를 정리해줘',
    answer: `한국 현대시 관련 자료를 분석했습니다.

발견한 핵심 작품들:

1. 저항과 순수: 윤동주의 서시 - 식민지 시대 지식인의 고뇌와 순수한 영혼
2. 민요적 서정: 김소월의 진달래꽃 - 이별의 정한, 한국인의 보편적 감성
3. 고향의 그리움: 정지용의 향수 - 선명한 이미지와 음악적 리듬
4. 북방 정서: 백석의 나와 나타샤 - 토속적 언어와 가난한 사랑

윤동주와 정지용의 시가 서정성에서 연결되어 있습니다.`,
    referencedNodes: [
      { id: 'demo_1', title: '윤동주의 서시', link: '/nodes/demo_1' },
      { id: 'demo_2', title: '김소월의 진달래꽃', link: '/nodes/demo_2' },
      { id: 'demo_3', title: '정지용의 향수', link: '/nodes/demo_3' },
      { id: 'demo_4', title: '백석의 나와 나타샤', link: '/nodes/demo_4' },
    ],
  },
  {
    question: '한국 현대소설을 알려줘',
    answer: `한국 현대소설의 주요 작품을 정리했습니다.

시대별 대표작:

1. 분단문학: 최인훈의 광장 - 이데올로기의 허상과 개인의 실존
2. 산업화 시대: 조세희의 난장이 - 소외된 자들의 아픔
3. 여성문학: 박완서의 나목 - 전쟁의 상처와 생존
4. 세계적 인정: 한강의 채식주의자 - 맨부커상 수상작

황석영과 조세희의 작품이 '산업화와 노동'이라는 주제로 연결됩니다.`,
    referencedNodes: [
      { id: 'demo_9', title: '한강의 채식주의자', link: '/nodes/demo_9' },
      { id: 'demo_12', title: '조세희의 난장이가 쏘아올린 작은 공', link: '/nodes/demo_12' },
      { id: 'demo_14', title: '최인훈의 광장', link: '/nodes/demo_14' },
      { id: 'demo_11', title: '박완서의 나목', link: '/nodes/demo_11' },
    ],
  },
  {
    question: '실존주의 문학을 알려줘',
    answer: `실존주의 관련 문학과 철학 자료입니다.

핵심 작품과 사상:

1. 부조리 철학
   - 카뮈의 이방인 - 부조리한 세계 속 인간
   - 태양 때문에 저지른 살인, 무의미한 세계

2. 실존의 불안
   - 카프카의 변신 - 실존적 소외의 우화
   - 사르트르의 실존주의 - 자유와 책임

3. 한국 문학의 수용
   - 최인훈의 광장 - 분단 속 개인의 실존 탐구

카뮈와 사르트르, 그리고 한국의 최인훈이 실존주의라는 주제로 연결됩니다.`,
    referencedNodes: [
      { id: 'demo_32', title: '알베르 카뮈의 이방인', link: '/nodes/demo_32' },
      { id: 'demo_28', title: '카프카의 변신', link: '/nodes/demo_28' },
      { id: 'demo_35', title: '사르트르의 실존주의', link: '/nodes/demo_35' },
      { id: 'demo_14', title: '최인훈의 광장', link: '/nodes/demo_14' },
    ],
  },
  {
    question: '고전문학 자료를 보여줘',
    answer: `한국 고전문학 자료를 정리했습니다.

판소리계 소설:
- 춘향전: 신분을 초월한 사랑과 절개
- 심청전: 효녀의 희생과 보은
- 흥부전: 권선징악과 민중의 꿈

한글소설의 시작:
- 홍길동전: 최초의 한글소설, 신분제 저항
- 구운몽: 불교적 세계관, 인생무상

우화소설:
- 토끼전: 풍자와 해학이 넘치는 이야기

춘향전과 심청전이 '여성 주인공'과 '판소리'로 연결되어 있습니다.`,
    referencedNodes: [
      { id: 'demo_16', title: '춘향전', link: '/nodes/demo_16' },
      { id: 'demo_19', title: '심청전', link: '/nodes/demo_19' },
      { id: 'demo_17', title: '홍길동전', link: '/nodes/demo_17' },
      { id: 'demo_18', title: '구운몽', link: '/nodes/demo_18' },
    ],
  },
  {
    question: '글쓰기에 참고할 자료는?',
    answer: `창작에 도움이 될 문학 자료를 모았습니다.

서사 구조 학습:
- 춘향전의 서사 구조 - 발단, 전개, 위기, 절정, 결말
- 홍길동전의 영웅 서사 - 비범한 탄생과 모험

문체와 기법:
- 김승옥의 감각적 문체 - 무진기행
- 버지니아 울프의 의식의 흐름 기법

캐릭터 연구:
- 도스토예프스키의 심리 묘사
- 헤세의 성장 서사

다양한 문학 작품들이 서로 영향을 주고받으며 연결되어 있습니다.`,
    referencedNodes: [
      { id: 'demo_15', title: '김승옥의 무진기행', link: '/nodes/demo_15' },
      { id: 'demo_31', title: '버지니아 울프의 댈러웨이 부인', link: '/nodes/demo_31' },
      { id: 'demo_29', title: '도스토예프스키의 죄와 벌', link: '/nodes/demo_29' },
      { id: 'demo_33', title: '헤르만 헤세의 데미안', link: '/nodes/demo_33' },
    ],
  },
  {
    question: '신화 이야기를 보여줘',
    answer: `문학과 연결된 신화/철학적 주제를 정리했습니다.

동양 사상:
- 유불선 사상이 문학에 미친 영향
- 구운몽의 불교적 세계관

서양 철학:
- 니체의 초인 사상과 영원회귀
- 푸코의 권력 이론과 담론 분석

문학과의 연결:
- 한용운의 님의 침묵 - 불교적 역설
- 정지용의 향수 - 동양적 자연관

동양 사상과 한국 현대시가 깊이 연결되어 있습니다.`,
    referencedNodes: [
      { id: 'demo_37', title: '동양 사상과 문학', link: '/nodes/demo_37' },
      { id: 'demo_34', title: '니체의 차라투스트라', link: '/nodes/demo_34' },
      { id: 'demo_18', title: '구운몽', link: '/nodes/demo_18' },
      { id: 'demo_5', title: '한용운의 님의 침묵', link: '/nodes/demo_5' },
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
    summary: '"죽는 날까지 하늘을 우러러 한 점 부끄럼이 없기를" - 저항시인의 순수한 영혼',
    text: `윤동주 (1917-1945) 서시 (序詩)

죽는 날까지 하늘을 우러러
한 점 부끄럼이 없기를,
잎새에 이는 바람에도
나는 괴로워했다.
별을 노래하는 마음으로
모든 죽어가는 것을 사랑해야지
그리고 나한테 주어진 길을
걸어가야겠다.

오늘 밤에도 별이 바람에 스치운다.

--- 윤동주는 일제강점기 암흑 속에서 순수한 영혼을 지키려 했던 저항시인입니다. 그의 시는 직접적인 저항이 아닌, 자기 성찰과 부끄러움을 통한 윤리적 저항이었습니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_2: {
    id: 'demo_2',
    summary: '이별의 정한, 한국인의 보편적 감성을 담은 민요적 서정시',
    text: `김소월 (1902-1934) 진달래꽃

나 보기가 역겨워
가실 때에는
말없이 고이 보내 드리우리다

영변에 약산
진달래꽃
아름 따다 가실 길에 뿌리우리다

가시는 걸음걸음
놓인 그 꽃을
사뿐히 즈려밟고 가시옵소서

나 보기가 역겨워
가실 때에는
죽어도 아니 눈물 흘리우리다

--- 김소월은 민요적 율격과 한국인의 보편적 정서인 '한(恨)'을 탁월하게 표현한 시인입니다. 이별의 슬픔을 역설적으로 표현하여 더욱 애절한 감정을 자아냅니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_9: {
    id: 'demo_9',
    summary: '폭력적 세계에 대한 거부, 식물이 되고자 하는 여성의 이야기',
    text: `한강 (1970-) 채식주의자 (2007)

"나는 꿈을 꾸었어요. 숲에서 피투성이가 된 얼굴들을요."

영혜는 어느 날 갑자기 고기를 먹지 않겠다고 선언한다. 단순한 식습관의 변화가 아니라, 폭력적인 세계에 대한 거부이자 인간이기를 그만두려는 시도였다.

세 부분으로 구성된 이 소설은 각각 '채식주의자', '몽고반점', '나무 불꽃'이라는 제목으로 영혜의 변화를 다른 시선에서 조명한다.

--- 2016년 맨부커 인터내셔널상 수상작. 한강은 인간 내면의 폭력성과 그것으로부터의 탈출을 섬세하게 그려냈습니다.`,
    format: 'article',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_16: {
    id: 'demo_16',
    summary: '신분을 초월한 사랑과 절개, 한국 고전소설의 대표작',
    text: `춘향전 (春香傳)

양반 자제 이몽룡과 퇴기의 딸 춘향의 신분을 초월한 사랑 이야기.

주요 장면:
1. 광한루에서의 만남 - 이몽룡이 그네 타는 춘향을 보고 반함
2. 백년가약 - 춘향의 집에서 사랑을 맹세
3. 이별 - 이몽룡이 한양으로 떠남
4. 변학도의 수청 강요 - 춘향의 절개
5. 어사출도 - 암행어사가 된 이몽룡의 귀환

--- 판소리로도 전해지는 춘향전은 신분제에 대한 저항, 여성의 절개, 정의의 실현이라는 주제를 담고 있습니다.`,
    format: 'memo',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  demo_29: {
    id: 'demo_29',
    summary: '살인자의 내면 탐구, 죄의식과 구원에 대한 심리소설',
    text: `표도르 도스토예프스키 (1821-1881) 죄와 벌 (1866)

"범죄는 일종의 병이다. 그것은 결단코 논쟁의 여지가 없다."

가난한 대학생 라스콜니코프는 '비범한 인간'이라는 이론에 빠져 전당포 노파를 살해한다. 그러나 살인 후 그를 기다리는 것은 영웅적 성취가 아닌 끝없는 죄의식과 고통이다.

소냐라는 순수한 영혼과의 만남을 통해 그는 결국 자수하고, 시베리아 유형지에서 구원의 가능성을 발견한다.

--- 도스토예프스키는 인간 내면의 깊은 곳에 도사린 선과 악의 대립을 탁월하게 그려낸 심리소설의 대가입니다.`,
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
