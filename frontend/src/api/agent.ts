import type { AgentChatResponse, ReferencedNode } from '@/types';
import { loadNodes, mockClusters, mockBridges } from '@/mocks/data';
import { searchNodes } from './search';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  await delay(800); // AI 응답 시뮬레이션

  const intent = classifyIntent(message);
  let response = '';
  let referencedNodes: ReferencedNode[] = [];
  const nodes = loadNodes();

  if (intent === 'cluster_analysis') {
    response = `현재 저장된 ${nodes.length}개의 자료를 분석한 결과, ${mockClusters.length}개의 주요 주제로 분류할 수 있습니다:\n\n`;

    mockClusters.forEach((cluster, index) => {
      response += `**${index + 1}. ${cluster.theme}**\n`;
      cluster.node_ids.forEach((id, i) => {
        response += `- [${id}] ${cluster.node_summaries[i]}\n`;
        referencedNodes.push({
          id,
          title: cluster.node_summaries[i],
          link: `/nodes/${id}`,
        });
      });
      response += '\n';
    });

    response += '각 노드를 클릭하면 상세 내용을 확인할 수 있습니다.';

  } else if (intent === 'bridge_analysis') {
    response = `서로 다른 주제를 연결하는 **브리지 노드**를 ${mockBridges.length}개 발견했습니다:\n\n`;

    mockBridges.forEach((bridge, index) => {
      response += `**${index + 1}. [${bridge.id}] ${bridge.summary}**\n`;
      response += `   - 연결 강도: ${(bridge.bridge_score * 100).toFixed(0)}%\n`;
      response += `   - 연결된 클러스터: ${bridge.connected_clusters.map(c => mockClusters[c]?.theme.split('(')[0].trim()).join(', ')}\n\n`;
      referencedNodes.push({
        id: bridge.id,
        title: bridge.summary,
        link: `/nodes/${bridge.id}`,
      });
    });

    response += '이 노드들은 서로 다른 주제 간의 새로운 연결 가능성을 보여줍니다.';

  } else if (intent === 'search') {
    const searchResults = await searchNodes(message, 5);

    if (searchResults.length > 0) {
      response = `"${message}"와 관련된 자료를 ${searchResults.length}개 찾았습니다:\n\n`;

      searchResults.forEach((result, index) => {
        response += `**${index + 1}. [${result.id}] ${result.summary}**\n`;
        response += `   - 관련도: ${(result.score * 100).toFixed(0)}%\n\n`;
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
    // 일반 대화
    if (nodes.length === 0) {
      response = '아직 저장된 자료가 없습니다. 먼저 자료를 추가해보세요!\n\n"자료 추가" 버튼을 클릭하여 기사, 논문, 메모, 아이디어를 저장할 수 있습니다.';
    } else {
      response = `안녕하세요! NOVA Agent입니다. 현재 ${nodes.length}개의 노드가 저장되어 있습니다.\n\n`;
      response += '다음과 같은 질문을 해보세요:\n';
      response += '- "주제별로 분류해줘"\n';
      response += '- "약한 연결을 찾아줘"\n';
      response += '- "AI 관련 자료 검색해줘"\n';
    }
  }

  return {
    response,
    referenced_nodes: referencedNodes,
    action_type: intent,
  };
}
