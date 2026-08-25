"""LangChain LLM 客户端 - 基础工具

提供:
- 对话模型 / 视觉模型客户端 (OpenAI 兼容协议)
- 多模态消息构建 (文本 + 图片 → base64 content blocks)
- 模型 JSON 输出解析 (兼容 ```json 代码块包裹)
"""
import base64
import json
import re
from typing import Any

from langchain_core.messages import AIMessage, HumanMessage
from langchain_openai import ChatOpenAI

from config import get_settings


def get_chat_llm() -> ChatOpenAI:
    """对话模型 (文本): 交互回复 / 创意建议"""
    s = get_settings()
    return ChatOpenAI(
        model=s.chat_model,
        api_key=s.llm_api_key,
        base_url=s.llm_base_url,
        temperature=s.llm_temperature,
    )


def get_vision_llm() -> ChatOpenAI:
    """视觉模型 (多模态): 食材识别"""
    s = get_settings()
    return ChatOpenAI(
        model=s.vision_model,
        api_key=s.llm_api_key,
        base_url=s.llm_base_url,
        temperature=0,
    )


def build_image_message(prompt: str, image_bytes: bytes, mime_type: str = "image/jpeg") -> HumanMessage:
    """构建多模态消息 (文本 + 图片), 兼容 OpenAI 协议的视觉模型

    Args:
        prompt: 文本提示词
        image_bytes: 图片二进制 (建议先经 compress_image 压缩)
        mime_type: 图片 MIME 类型
    """
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return HumanMessage(content=[
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64}"}},
    ])


def parse_json_output(ai_message: AIMessage) -> Any:
    """解析模型的 JSON 输出 (自动去除 ```json 代码块包裹)

    Raises:
        json.JSONDecodeError: 输出不是合法 JSON
    """
    text = (ai_message.content or "").strip()
    matched = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if matched:
        text = matched.group(1).strip()
    return json.loads(text)
