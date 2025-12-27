import type { SearchResult } from '@/types';
import { loadNodes } from '@/mocks/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 간단한 텍스트 유사도 계산
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();

  let matches = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      matches++;
    }
  }

  return matches / queryWords.length;
}

export async function searchNodes(query: string, topK: number = 10): Promise<SearchResult[]> {
  await delay(300);

  const nodes = loadNodes();

  const results = nodes
    .map(node => {
      const score = Math.max(
        calculateSimilarity(query, node.text),
        calculateSimilarity(query, node.summary),
        node.context ? calculateSimilarity(query, node.context) : 0
      );

      return {
        id: node.id,
        score,
        summary: node.summary,
        text: node.text,
        format: node.format,
        context: node.context,
      };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}
