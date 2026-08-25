"""联网搜索基础工具 (Tavily)"""
from typing import Any, Dict, List

from config import get_settings


async def web_search(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """联网搜索 (Tavily), 供食谱检索等场景使用

    Args:
        query: 搜索关键词
        max_results: 返回结果条数
    Returns:
        结果列表, 每项含 title / url / content / score 字段
    Raises:
        ValueError: 未配置 TAVILY_API_KEY
    """
    api_key = get_settings().tavily_api_key
    if not api_key:
        raise ValueError("未配置 TAVILY_API_KEY, 请在 .env 中设置 (参考 .env.example)")

    from langchain_tavily import TavilySearch

    tool = TavilySearch(max_results=max_results, tavily_api_key=api_key)
    return await tool.ainvoke({"query": query})
