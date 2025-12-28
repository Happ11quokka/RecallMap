"""
Cohere 없이 간단한 Rerank 구현 (LLM 기반)
비용이 들지만 Cohere API 키 불필요
"""

from typing import List, Dict, Any
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)


class SimpleReranker:
    """OpenAI GPT로 간단한 Rerank 구현"""

    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def rerank(
        self,
        query: str,
        documents: List[Dict[str, Any]],
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        GPT-4를 사용한 간단한 rerank

        주의: Cohere보다 느리고 비용이 높음
        """
        try:
            # 문서 준비
            doc_list = []
            for i, doc in enumerate(documents[:20]):  # 최대 20개만
                doc_list.append(f"{i}. {doc['summary']}")

            prompt = f"""Given the query and documents, rank the top {top_k} most relevant documents.

Query: {query}

Documents:
{chr(10).join(doc_list)}

Return only the indices (0-based) of the top {top_k} documents, separated by commas.
Example: 2,5,1,8,3"""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a document ranking expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0,
                max_tokens=100
            )

            # 결과 파싱
            result_text = response.choices[0].message.content.strip()
            indices = [int(idx.strip()) for idx in result_text.split(",")]

            # 재정렬
            reranked = []
            for idx in indices[:top_k]:
                if idx < len(documents):
                    doc = documents[idx].copy()
                    doc['rerank_score'] = 1.0 - (len(reranked) * 0.1)  # 가짜 점수
                    doc['evidence'] = f"GPT-4 선택: {query}와 관련성 높음"
                    reranked.append(doc)

            return reranked

        except Exception as e:
            logger.error(f"Rerank failed: {e}")
            # 실패 시 원본 반환
            return documents[:top_k]


# 사용 예시
"""
reranker = SimpleReranker(api_key="sk-...")
reranked = reranker.rerank(
    query="비 오는 날 감성",
    documents=search_results
)
"""
