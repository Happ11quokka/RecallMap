import type { Node, NodeCreateRequest, NodeCreateResponse, GraphData } from '@/types';
import { loadNodes, saveNodes, mockClusters, mockBridges } from '@/mocks/data';

// 딜레이 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 간단한 요약 생성 (Mock)
function generateSummary(text: string): string {
  // 첫 문장 또는 50자까지 추출
  const firstSentence = text.split(/[.!?]/)[0];
  return firstSentence.length > 50 ? firstSentence.slice(0, 50) + '...' : firstSentence;
}

export async function createNode(data: NodeCreateRequest): Promise<NodeCreateResponse> {
  await delay(500); // API 호출 시뮬레이션

  const nodes = loadNodes();
  const newNode: Node = {
    id: `node_${Date.now().toString(36)}`,
    summary: generateSummary(data.text),
    text: data.text,
    format: data.format,
    context: data.context,
    created_at: new Date().toISOString(),
  };

  nodes.unshift(newNode);
  saveNodes(nodes);

  return {
    id: newNode.id,
    summary: newNode.summary,
    embedding_stored: true,
    created_at: newNode.created_at,
  };
}

export async function getNodes(): Promise<Node[]> {
  await delay(200);
  return loadNodes();
}

export async function getNode(id: string): Promise<Node> {
  await delay(100);
  const nodes = loadNodes();
  const node = nodes.find(n => n.id === id);
  if (!node) {
    throw new Error('Node not found');
  }
  return node;
}

export async function deleteNode(id: string): Promise<void> {
  await delay(200);
  const nodes = loadNodes();
  const filtered = nodes.filter(n => n.id !== id);
  saveNodes(filtered);
}

export async function getGraphData(): Promise<GraphData> {
  await delay(300);
  const nodes = loadNodes();

  // 저장된 노드들로 그래프 노드 생성
  const graphNodes = nodes.map((node, index) => ({
    id: node.id,
    label: node.summary,
    format: node.format,
    summary: node.summary,
    x: 200 + Math.cos((index / Math.max(nodes.length, 1)) * 2 * Math.PI) * 250,
    y: 250 + Math.sin((index / Math.max(nodes.length, 1)) * 2 * Math.PI) * 200,
  }));

  // 엣지 생성 (인접 노드끼리 연결)
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // 간단한 유사도 계산 (같은 format이면 더 높은 가중치)
      const weight = nodes[i].format === nodes[j].format ? 0.7 + Math.random() * 0.2 : 0.4 + Math.random() * 0.2;
      if (weight > 0.5) {
        edges.push({
          source: nodes[i].id,
          target: nodes[j].id,
          weight,
        });
      }
    }
  }

  return { nodes: graphNodes, edges };
}

export async function getClusters() {
  await delay(400);
  return { clusters: mockClusters, total_nodes: loadNodes().length };
}

export async function getBridges() {
  await delay(400);
  return { bridges: mockBridges };
}
