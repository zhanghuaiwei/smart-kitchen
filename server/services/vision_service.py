"""食材识别服务 (核心功能 1: 图片识别)"""
from typing import List

from schemas import Ingredient

# 识别提示词模板, 人工实现时可直接使用
VISION_PROMPT = (
    "你是一名食材识别专家。请识别图片中所有可食用的食材(蔬菜/水果/肉类/蛋类/水产/豆制品等)。"
    '仅输出 JSON 数组, 每个元素格式为 {"name": "食材名", "confidence": 0.9}, '
    "confidence 为识别置信度(0-1)。不要输出 JSON 以外的任何内容。"
)


async def recognize_ingredients(image_bytes: bytes) -> List[Ingredient]:
    """识别图片中的食材

    Args:
        image_bytes: 原始图片二进制 (JPEG/PNG)
    Returns:
        识别出的食材列表
    """
    # ==================== 核心实现占位 ====================
    # TODO(人工实现): 调用多模态大模型完成食材识别
    #   可用基础工具:
    #     - compress_image(image_bytes)                    压缩图片, 降低 token 消耗
    #     - build_image_message(VISION_PROMPT, image_bytes) 构建"文本+图片"多模态消息
    #     - get_vision_llm().ainvoke([...])                调用视觉模型
    #     - parse_json_output(ai_message)                  解析模型返回的 JSON
    raise NotImplementedError("食材识别核心逻辑待人工实现")
