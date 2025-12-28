from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_cohere import CohereRerank
from typing import List, Dict, Any, Optional
import logging
import os
from app.core.config import get_settings

logger = logging.getLogger(__name__)


class LLMService:
    """LLM 서비스 (요약, 키워드 추출, 답변 생성)"""

    def __init__(self):
        self.settings = get_settings()
        self.embeddings = OpenAIEmbeddings(
            model=self.settings.embedding_model,
            openai_api_key=self.settings.openai_api_key
        )
        self.llm = ChatOpenAI(
            model=self.settings.llm_model,
            temperature=0.3,
            openai_api_key=self.settings.openai_api_key
        )
        self.reranker = CohereRerank(
            model=self.settings.rerank_model,
            cohere_api_key=self.settings.cohere_api_key
        )

    def generate_embedding(self, text: str) -> List[float]:
        """텍스트 임베딩 생성"""
        try:
            logger.info(f"🔹 Embedding generation - text length: {len(text)}")
            embedding = self.embeddings.embed_query(text)
            logger.info(f"✅ Embedding generated - dimension: {len(embedding)}")
            return embedding
        except Exception as e:
            logger.error(f"❌ Error generating embedding: {e}")
            raise

    def generate_summary(self, text: str, max_length: int = 100) -> str:
        """문서 한 줄 요약 생성"""
        try:
            logger.info(f"🔹 Summary generation - text length: {len(text)}")
            from langchain_core.prompts import ChatPromptTemplate

            prompt = ChatPromptTemplate.from_messages([
                ("system", "당신은 문서 요약 전문가입니다. 핵심만 담아 간결하게 요약합니다."),
                ("human", """다음 텍스트를 한 줄로 요약해주세요. 핵심만 간결하게 담아주세요.
최대 {max_length}자 이내로 작성하세요.

텍스트:
{text}

한 줄 요약:""")
            ])

            chain = prompt | self.llm
            response = chain.invoke({"text": text[:2000], "max_length": max_length})
            summary = response.content.strip()

            logger.info(f"✅ Summary generated - length: {len(summary)}")
            return summary
        except Exception as e:
            logger.error(f"❌ Error generating summary: {e}")
            raise

    def extract_keywords(self, text: str, max_keywords: int = 5) -> List[str]:
        """키워드 추출"""
        try:
            from langchain_core.prompts import ChatPromptTemplate

            prompt = ChatPromptTemplate.from_messages([
                ("system", "당신은 키워드 추출 전문가입니다."),
                ("human", """다음 텍스트에서 핵심 키워드를 추출해주세요.
검색에 유용한 단어를 {max_keywords}개 이하로 선택하세요.
키워드만 쉼표로 구분해서 나열하세요.

텍스트:
{text}

키워드:""")
            ])

            keyword_llm = ChatOpenAI(
                model=self.settings.llm_model,
                temperature=0.2,
                openai_api_key=self.settings.openai_api_key
            )

            chain = prompt | keyword_llm
            response = chain.invoke({"text": text[:1500], "max_keywords": max_keywords})

            keywords_text = response.content.strip()
            keywords = [k.strip() for k in keywords_text.split(",")]
            return keywords[:max_keywords]
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            raise

    def rerank_results(
        self,
        query: str,
        documents: List[Dict[str, Any]],
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """Cohere Rerank로 결과 재정렬 + evidence 추출"""
        try:
            from langchain_core.documents import Document

            # Cohere rerank용 문서 준비
            doc_texts = [
                f"{doc['summary']}\n{doc.get('preview', '')}"
                for doc in documents
            ]

            # LangChain Documents로 변환
            langchain_docs = [Document(page_content=text) for text in doc_texts]

            # Rerank 실행
            reranked_docs = self.reranker.compress_documents(
                documents=langchain_docs,
                query=query
            )

            # 결과 재구성
            reranked = []
            for i, doc in enumerate(reranked_docs[:top_k]):
                # 원본 문서 찾기
                original_index = doc_texts.index(doc.page_content)
                original_doc = documents[original_index]

                # evidence 생성
                evidence = self._extract_evidence(query, original_doc)

                reranked.append({
                    **original_doc,
                    "rerank_score": getattr(doc.metadata, 'relevance_score', 0.0),
                    "evidence": evidence
                })

            return reranked

        except Exception as e:
            logger.error(f"Error reranking: {e}")
            raise

    def _extract_evidence(self, query: str, document: Dict[str, Any]) -> str:
        """간단한 evidence 추출 (쿼리와 관련된 부분 찾기)"""
        summary = document.get("summary", "")
        preview = document.get("preview", "")

        # 쿼리 단어들
        query_words = set(query.lower().split())

        # summary에서 매칭되는 부분 찾기
        if any(word in summary.lower() for word in query_words):
            return f"요약에서 '{query}' 관련 내용 포함"

        # preview에서 매칭되는 부분 찾기
        for sentence in preview.split("."):
            if any(word in sentence.lower() for word in query_words):
                return sentence.strip()[:100] + "..."

        return "문서 내용과 관련성 있음"

    def compose_answer(
        self,
        query: str,
        source_documents: List[Dict[str, Any]],
        max_docs: int = 3
    ) -> Dict[str, Any]:
        """검색 결과 기반 답변 생성"""
        try:
            # 상위 문서들 컨텍스트 구성
            context_parts = []
            for i, doc in enumerate(source_documents[:max_docs], 1):
                context_parts.append(
                    f"[문서 {i}] {doc['summary']}\n{doc.get('preview', '')[:300]}"
                )

            context = "\n\n".join(context_parts)

            from langchain_core.prompts import ChatPromptTemplate

            prompt = ChatPromptTemplate.from_messages([
                ("system", "당신은 문서 기반 답변 생성 전문가입니다. 제공된 문서만을 기반으로 정확하게 답변합니다."),
                ("human", """사용자의 질문에 대해 제공된 문서들을 기반으로 답변을 작성해주세요.

질문: {query}

관련 문서들:
{context}

다음 형식으로 답변해주세요:
1. 답변: 2-6문장으로 핵심 내용 요약
2. 핵심 포인트: 3가지 중요한 점을 간결하게

답변:""")
            ])

            answer_llm = ChatOpenAI(
                model=self.settings.llm_model,
                temperature=0.5,
                openai_api_key=self.settings.openai_api_key
            )

            chain = prompt | answer_llm
            response = chain.invoke({"query": query, "context": context})

            answer_text = response.content.strip()

            # 답변과 핵심 포인트 분리
            parts = answer_text.split("핵심 포인트")
            main_answer = parts[0].replace("답변:", "").strip()

            # 핵심 포인트 추출
            highlights = []
            if len(parts) > 1:
                highlight_text = parts[1].strip()
                for line in highlight_text.split("\n"):
                    line = line.strip()
                    if line and not line.startswith("핵심"):
                        # 불릿 포인트 제거
                        clean_line = line.lstrip("•-123456789. ").strip()
                        if clean_line:
                            highlights.append(clean_line)

            # 최대 3개로 제한
            highlights = highlights[:3]

            # 기본값 설정
            if not highlights:
                highlights = ["문서 기반 답변", "관련 정보 포함", "추가 검색 가능"]

            return {
                "answer": main_answer,
                "highlights": highlights,
                "source_documents": source_documents[:max_docs]
            }

        except Exception as e:
            logger.error(f"Error composing answer: {e}")
            raise


# 싱글톤 인스턴스
_llm_service = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
