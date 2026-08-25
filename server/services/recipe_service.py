"""食谱搜索与排序服务 (核心功能 2: 智能搜索 / 核心功能 3: 智能排序)"""
from typing import List, Optional

from schemas import Recipe


async def search_recipes(ingredients: List[str], query: Optional[str] = None) -> List[Recipe]:
    """根据食材(及用户文本描述)搜索相关食谱

    Args:
        ingredients: 食材名称列表, 如 ["番茄", "鸡蛋"]
        query: 用户的文本描述, 可能为空
    """
    # ==================== 核心实现占位 ====================
    # TODO(人工实现): 食谱检索, 常见方案:
    #   方案A - 联网搜索: 用 web_search() (Tavily) 检索食谱, 再由大模型解析结构化
    #   方案B - 大模型生成: 由对话模型根据食材直接生成推荐食谱列表
    #   可用基础工具: web_search() / get_chat_llm() / parse_json_output()
    raise NotImplementedError("食谱搜索核心逻辑待人工实现")


async def rank_recipes(
    recipes: List[Recipe],
    sort_by: str = "nutrition",
    preference: Optional[str] = None,
) -> List[Recipe]:
    """按营养价值、制作难度对食谱智能排序

    Args:
        recipes: 待排序食谱列表
        sort_by: 排序维度 nutrition(默认) | difficulty
        preference: 用户偏好描述(如"低脂""快手"), 可为空
    """
    # ==================== 核心实现占位 ====================
    # TODO(人工实现): 排序策略, 参考:
    #   - 规则排序: nutrition_score 降序 + difficulty 升序加权
    #   - 模型排序: 将食谱列表 + 用户偏好交给大模型综合打分排序
    raise NotImplementedError("食谱排序核心逻辑待人工实现")
