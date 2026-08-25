"""创意搭配建议服务 (核心功能 4: 创意建议)"""
from typing import List, Optional

# 创意建议提示词模板, 人工实现时可直接使用
CREATIVE_PROMPT = (
    "你是一名创意私厨。现有食材: {ingredients}。用户诉求: {query}。\n"
    "请给出 3 条有创意的搭配做法建议, 每条一句话, 点出菜式创意与亮点, 只输出建议列表。"
)


async def suggest_creative(ingredients: List[str], query: Optional[str] = None) -> List[str]:
    """常规食谱搜索无结果时, 提供创意搭配建议

    Args:
        ingredients: 现有食材名称列表
        query: 用户的文本描述, 可能为空
    """
    # ==================== 核心实现占位 ====================
    # TODO(人工实现): 调用对话大模型生成创意搭配建议
    #   可用基础工具: get_chat_llm() (ainvoke 调用), 提示词模板 CREATIVE_PROMPT
    raise NotImplementedError("创意建议核心逻辑待人工实现")
