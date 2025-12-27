export type NodeFormat = 'article' | 'paper' | 'memo' | 'idea';

export interface Node {
  id: string;
  summary: string;
  text: string;
  format: NodeFormat;
  context?: string;
  created_at: string;
}

export interface NodeCreateRequest {
  text: string;
  format: NodeFormat;
  context?: string;
}

export interface NodeCreateResponse {
  id: string;
  summary: string;
  embedding_stored: boolean;
  created_at: string;
}

export interface GraphNode {
  id: string;
  label: string;
  format: NodeFormat;
  summary: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchResult {
  id: string;
  score: number;
  summary: string;
  text: string;
  format: NodeFormat;
  context?: string;
}

export interface ReferencedNode {
  id: string;
  title: string;
  link: string;
}

export interface AgentChatResponse {
  response: string;
  referenced_nodes: ReferencedNode[];
  action_type: 'search' | 'cluster_analysis' | 'bridge_analysis' | 'general';
}

export interface ClusterInfo {
  cluster_id: number;
  theme: string;
  node_ids: string[];
  node_summaries: string[];
}

export interface BridgeNode {
  id: string;
  summary: string;
  connected_clusters: number[];
  bridge_score: number;
}

export interface ActivityLogEntry {
  node_id: string;
  summary: string;
  viewed_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  referenced_nodes?: ReferencedNode[];
  timestamp: Date;
}
