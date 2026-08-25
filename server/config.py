"""全局配置 - 通过环境变量 / .env 文件加载 (参考 .env.example)"""
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ---- LLM 配置 (OpenAI 兼容协议) ----
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    vision_model: str = "gpt-4o-mini"   # 多模态视觉模型: 食材识别
    chat_model: str = "gpt-4o-mini"     # 对话模型: 交互回复 / 创意建议
    llm_temperature: float = 0.3

    # ---- 联网搜索 (Tavily) ----
    tavily_api_key: str = ""

    # ---- 服务配置 ----
    host: str = "0.0.0.0"
    port: int = 8000
    max_image_size_mb: int = 8          # 上传图片大小上限

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
