from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # API Keys
    openai_api_key: str
    cohere_api_key: str

    # Pinecone
    pinecone_api_key: str
    pinecone_environment: str
    pinecone_index_name: str = "recallmap"

    # LangSmith (Optional)
    langchain_tracing_v2: Optional[str] = None
    langchain_api_key: Optional[str] = None
    langchain_project: str = "recallmap"
    langchain_endpoint: str = "https://api.smith.langchain.com"

    # Models
    embedding_model: str = "text-embedding-3-small"
    embedding_dimension: int = 1536
    llm_model: str = "gpt-4-turbo-preview"
    rerank_model: str = "rerank-multilingual-v3.0"

    # App Settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    chunk_size: int = 1000
    chunk_overlap: int = 200

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
