"""API 数据模型 - 与客户端 src/types.ts 保持一致"""
from typing import List, Optional

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    """识别出的食材"""
    name: str = Field(..., description="食材名称, 如: 番茄")
    confidence: float = Field(0.9, ge=0, le=1, description="识别置信度 0-1")


class Recipe(BaseModel):
    """食谱"""
    id: str
    name: str
    description: str = ""
    ingredients: List[str] = []
    steps: List[str] = []
    nutrition_score: float = Field(0, ge=0, le=100, description="营养价值评分 0-100")
    difficulty: int = Field(1, ge=1, le=5, description="制作难度 1-5")
    time_minutes: int = 0
    tags: List[str] = []


class ChatHistoryItem(BaseModel):
    """对话历史条目"""
    role: str = "user"   # user | assistant
    content: str = ""


class ChatRequest(BaseModel):
    """对话请求: 文本 + 可选图片"""
    message: str = ""
    image_base64: Optional[str] = None
    history: List[ChatHistoryItem] = []


class ChatResponse(BaseModel):
    """对话响应: 结构化返回, 客户端按区块渲染"""
    reply: str
    ingredients: List[Ingredient] = []
    recipes: List[Recipe] = []
    creative_suggestions: List[str] = []


class RecognizeResponse(BaseModel):
    ingredients: List[Ingredient]


class RecipeSearchRequest(BaseModel):
    ingredients: List[str] = []
    query: Optional[str] = None


class RecipeSearchResponse(BaseModel):
    recipes: List[Recipe]


class RecipeRankRequest(BaseModel):
    recipes: List[Recipe]
    sort_by: str = "nutrition"   # nutrition | difficulty


class RecipeRankResponse(BaseModel):
    recipes: List[Recipe]


class CreativeSuggestRequest(BaseModel):
    ingredients: List[str] = []
    query: Optional[str] = None


class CreativeSuggestResponse(BaseModel):
    suggestions: List[str]
