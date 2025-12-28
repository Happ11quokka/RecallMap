"""
LangSmith 추적 설정

LangSmith를 사용하여 모든 LLM 호출을 모니터링할 수 있습니다.
https://smith.langchain.com/
"""

import os
import logging
from functools import wraps
from typing import Any, Callable
from app.core.config import get_settings

logger = logging.getLogger(__name__)


def init_langsmith():
    """
    LangSmith 추적 초기화

    .env 파일에 다음 변수 설정:
    - LANGCHAIN_TRACING_V2=true
    - LANGCHAIN_API_KEY=lsv2_...
    - LANGCHAIN_PROJECT=recallmap
    """
    settings = get_settings()

    if settings.langchain_tracing_v2 and settings.langchain_api_key:
        os.environ["LANGCHAIN_TRACING_V2"] = settings.langchain_tracing_v2
        os.environ["LANGCHAIN_API_KEY"] = settings.langchain_api_key
        os.environ["LANGCHAIN_PROJECT"] = settings.langchain_project
        os.environ["LANGCHAIN_ENDPOINT"] = settings.langchain_endpoint

        logger.info(f"✅ LangSmith 추적 활성화: {settings.langchain_project}")
        logger.info(f"   Dashboard: https://smith.langchain.com/o/default/projects/p/{settings.langchain_project}")
    else:
        logger.info("ℹ️  LangSmith 추적 비활성화 (선택사항)")


def trace_llm_call(operation_name: str):
    """
    LLM 호출을 추적하는 데코레이터

    사용 예:
    @trace_llm_call("generate_summary")
    def generate_summary(text: str):
        ...
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            try:
                from langsmith import trace
                with trace(name=operation_name):
                    return await func(*args, **kwargs)
            except ImportError:
                # langsmith 없으면 그냥 실행
                return await func(*args, **kwargs)

        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            try:
                from langsmith import trace
                with trace(name=operation_name):
                    return func(*args, **kwargs)
            except ImportError:
                # langsmith 없으면 그냥 실행
                return func(*args, **kwargs)

        # async 함수인지 확인
        import inspect
        if inspect.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


def log_trace_url(run_id: str):
    """
    LangSmith 추적 URL 로그 출력
    """
    settings = get_settings()
    if settings.langchain_api_key:
        url = f"https://smith.langchain.com/o/default/projects/p/{settings.langchain_project}/r/{run_id}"
        logger.info(f"📊 LangSmith Trace: {url}")
