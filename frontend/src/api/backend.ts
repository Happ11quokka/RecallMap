/**
 * RecallMap 백엔드 API 클라이언트
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DocumentUploadRequest {
  text: string;
  project: string;
  filename?: string;
}

export interface DocumentIngestResponse {
  id: string;
  summary: string;
  keywords: string[];
  preview: string;
  project: string;
  created_at: string;
  embedding_stored: boolean;
}

export interface SearchRequest {
  query: string;
  project?: string;
  search_scope?: 'summary' | 'content' | 'both';
  top_k?: number;
  use_rerank?: boolean;
}

export interface SearchResultItem {
  id: string;
  score: number;
  summary: string;
  preview: string;
  keywords: string[];
  project: string;
  filename?: string;
  evidence?: string;
  created_at: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  reranked: boolean;
  total_found: number;
}

export interface AnswerRequest {
  query: string;
  top_results: SearchResultItem[];
  max_results_to_use?: number;
}

export interface AnswerResponse {
  answer: string;
  highlights: string[];
  source_documents: SearchResultItem[];
}

/**
 * 파일 업로드 (multipart/form-data)
 */
export async function uploadFile(file: File, project: string): Promise<DocumentIngestResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project', project);

  const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

/**
 * 텍스트 직접 업로드
 */
export async function uploadText(request: DocumentUploadRequest): Promise<DocumentIngestResponse> {
  const response = await fetch(`${API_BASE_URL}/api/documents/upload-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

/**
 * 문서 검색
 */
export async function searchDocuments(request: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/api/documents/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.query,
      project: request.project,
      search_scope: request.search_scope || 'both',
      top_k: request.top_k || 10,
      use_rerank: request.use_rerank !== false, // 기본값 true
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Search failed');
  }

  return response.json();
}

/**
 * 답변 생성
 */
export async function composeAnswer(request: AnswerRequest): Promise<AnswerResponse> {
  const response = await fetch(`${API_BASE_URL}/api/documents/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.query,
      top_results: request.top_results,
      max_results_to_use: request.max_results_to_use || 3,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Answer composition failed');
  }

  return response.json();
}

/**
 * 벡터 DB 통계
 */
export async function getStats(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/documents/stats`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get stats');
  }

  return response.json();
}

/**
 * 헬스 체크
 */
export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
