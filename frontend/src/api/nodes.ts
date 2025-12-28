import type { GraphData, Node, NodeCreateRequest } from '@/types';
import { uploadText } from './backend';

// API 베이스 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * 그래프 데이터 가져오기 (백엔드 API 연동)
 */
export async function getGraphData(
  project?: string,
  minSimilarity: number = 0.5,
  topK: number = 50
): Promise<GraphData> {
  const params = new URLSearchParams();
  if (project) params.append('project', project);
  params.append('min_similarity', minSimilarity.toString());
  params.append('top_k', topK.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/graphs/data?${params}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch graph data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 특정 노드 상세 정보 조회
 */
export async function getNode(nodeId: string): Promise<Node> {
  const response = await fetch(`${API_BASE_URL}/api/graphs/nodes/${nodeId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch node: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 노드 삭제
 */
export async function deleteNode(nodeId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/graphs/nodes/${nodeId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete node: ${response.statusText}`);
  }
}

/**
 * 새 노드 생성 (문서 업로드)
 */
export async function createNode(request: NodeCreateRequest): Promise<void> {
  await uploadText({
    text: request.text,
    project: request.context || 'default',
  });
}
