import type { SearchResult } from '@/types';
import { searchDocuments } from './backend';

/**
 * 노드 검색 (백엔드 API 연동)
 */
export async function searchNodes(query: string, topK: number = 10): Promise<SearchResult[]> {
  try {
    const response = await searchDocuments({
      query,
      top_k: topK,
      search_scope: 'both',
      use_rerank: true,
    });

    return response.results.map((result) => ({
      id: result.id,
      score: result.score,
      summary: result.summary,
      text: result.preview,
      format: 'memo' as const,
      context: result.evidence,
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
