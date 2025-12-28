import type { AgentChatResponse, ReferencedNode } from '@/types';
import { searchNodes } from './search';
import { composeAnswer, getStats, type SearchResultItem } from './backend';

// 의도 분류
function classifyIntent(message: string): 'search' | 'cluster_analysis' | 'bridge_analysis' | 'general' {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('분류') || lowerMessage.includes('주제') || lowerMessage.includes('클러스터') || lowerMessage.includes('그룹')) {
    return 'cluster_analysis';
  }
  if (lowerMessage.includes('약한') || lowerMessage.includes('연결') || lowerMessage.includes('브리지') || lowerMessage.includes('의외') || lowerMessage.includes('새로운')) {
    return 'bridge_analysis';
  }
  if (lowerMessage.includes('검색') || lowerMessage.includes('찾아') || lowerMessage.includes('어디') || lowerMessage.includes('관련')) {
    return 'search';
  }
  return 'general';
}

export async function sendChatMessage(
  message: string,
  _sessionId?: string
): Promise<AgentChatResponse> {
  const intent = classifyIntent(message);
  let response = '';
  const referencedNodes: ReferencedNode[] = [];

  try {
    if (intent === 'cluster_analysis') {
      // 클러스터 분석은 아직 백엔드에 구현되지 않음
      response = '클러스터 분석 기능은 현재 개발 중입니다.\n\n';
      response += '대신 다음 기능을 사용해보세요:\n';
      response += '- 키워드로 자료 검색하기\n';
      response += '- 새 자료 추가하기';

    } else if (intent === 'bridge_analysis') {
      // 브리지 분석은 아직 백엔드에 구현되지 않음
      response = '브리지 노드 분석 기능은 현재 개발 중입니다.\n\n';
      response += '대신 다음 기능을 사용해보세요:\n';
      response += '- 키워드로 자료 검색하기\n';
      response += '- 그래프에서 연결된 노드 확인하기';

    } else if (intent === 'search') {
      const searchResults = await searchNodes(message, 5);

      if (searchResults.length > 0) {
        // 검색 결과를 기반으로 답변 생성
        const topResults: SearchResultItem[] = searchResults.map(r => ({
          id: r.id,
          score: r.score,
          summary: r.summary,
          preview: r.text,
          keywords: [],
          project: '',
          created_at: '',
        }));

        try {
          const answerResponse = await composeAnswer({
            query: message,
            top_results: topResults,
            max_results_to_use: 3,
          });

          response = answerResponse.answer + '\n\n';

          if (answerResponse.highlights.length > 0) {
            response += '**핵심 포인트:**\n';
            answerResponse.highlights.forEach((h, i) => {
              response += `${i + 1}. ${h}\n`;
            });
          }
        } catch {
          // 답변 생성 실패 시 검색 결과만 표시
          response = `"${message}"와 관련된 자료를 ${searchResults.length}개 찾았습니다:\n\n`;

          searchResults.forEach((result, index) => {
            response += `**${index + 1}. ${result.summary}**\n`;
            response += `   - 관련도: ${(result.score * 100).toFixed(0)}%\n\n`;
          });
        }

        searchResults.forEach(result => {
          referencedNodes.push({
            id: result.id,
            title: result.summary,
            link: `/nodes/${result.id}`,
          });
        });
      } else {
        response = `"${message}"와 관련된 자료를 찾지 못했습니다. 다른 키워드로 검색해보세요.`;
      }

    } else {
      // 일반 대화 - 통계 정보 확인
      try {
        const stats = await getStats();
        const totalVectors = stats.total_vector_count || 0;

        if (totalVectors === 0) {
          response = '아직 저장된 자료가 없습니다. 먼저 자료를 추가해보세요!\n\n"자료 추가" 버튼을 클릭하여 기사, 논문, 메모, 아이디어를 저장할 수 있습니다.';
        } else {
          response = `안녕하세요! NOVA Agent입니다. 현재 ${totalVectors}개의 노드가 저장되어 있습니다.\n\n`;
          response += '다음과 같은 질문을 해보세요:\n';
          response += '- "AI 관련 자료 검색해줘"\n';
          response += '- "최근 추가한 자료 찾아줘"\n';
        }
      } catch {
        response = '안녕하세요! NOVA Agent입니다.\n\n질문을 입력하면 관련 자료를 검색해드립니다.';
      }
    }
  } catch (error) {
    console.error('Agent error:', error);
    response = '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.';
  }

  return {
    response,
    referenced_nodes: referencedNodes,
    action_type: intent,
  };
}
