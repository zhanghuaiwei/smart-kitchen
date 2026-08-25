"""AI私厨管家 服务端入口

启动: cd server && uv run python main.py
接口文档: http://localhost:8000/docs
"""
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from schemas import (
    ChatRequest,
    ChatResponse,
    CreativeSuggestRequest,
    CreativeSuggestResponse,
    RecognizeResponse,
    RecipeRankRequest,
    RecipeRankResponse,
    RecipeSearchRequest,
    RecipeSearchResponse,
)
from services import chat_service, creative_service, recipe_service, vision_service
from tools.image_utils import check_image_size

settings = get_settings()

app = FastAPI(
    title="AI私厨管家 API",
    version="0.1.0",
    description="基于 LangChain 和多模态模型的食谱推荐服务",
)

# 跨域配置 (开发阶段放开)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _service_error(e: Exception) -> HTTPException:
    """统一的服务层异常转换"""
    if isinstance(e, NotImplementedError):
        return HTTPException(status_code=501, detail=f"该功能核心逻辑待人工实现: {e}")
    if isinstance(e, ValueError):
        return HTTPException(status_code=400, detail=str(e))
    return HTTPException(status_code=500, detail=f"服务内部错误: {e}")


@app.get("/health")
async def health():
    """健康检查 (客户端设置页"测试连接"使用)"""
    return {"status": "ok"}


@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """对话交互: 图片识别 + 食谱搜索 + 智能排序/创意建议, 一次性返回结构化结果"""
    try:
        return await chat_service.handle_chat(request)
    except (NotImplementedError, ValueError) as e:
        raise _service_error(e)


@app.post("/api/v1/vision/recognize", response_model=RecognizeResponse)
async def recognize(image: UploadFile = File(...)):
    """独立的食材识别接口 (multipart 上传图片)"""
    try:
        image_bytes = await image.read()
        check_image_size(image_bytes)
        ingredients = await vision_service.recognize_ingredients(image_bytes)
        return RecognizeResponse(ingredients=ingredients)
    except (NotImplementedError, ValueError) as e:
        raise _service_error(e)


@app.post("/api/v1/recipes/search", response_model=RecipeSearchResponse)
async def search_recipes(request: RecipeSearchRequest):
    """根据食材搜索食谱"""
    try:
        recipes = await recipe_service.search_recipes(request.ingredients, request.query)
        return RecipeSearchResponse(recipes=recipes)
    except NotImplementedError as e:
        raise _service_error(e)


@app.post("/api/v1/recipes/rank", response_model=RecipeRankResponse)
async def rank_recipes(request: RecipeRankRequest):
    """对食谱列表智能排序"""
    try:
        recipes = await recipe_service.rank_recipes(request.recipes, sort_by=request.sort_by)
        return RecipeRankResponse(recipes=recipes)
    except NotImplementedError as e:
        raise _service_error(e)


@app.post("/api/v1/creative/suggest", response_model=CreativeSuggestResponse)
async def creative_suggest(request: CreativeSuggestRequest):
    """创意搭配建议"""
    try:
        suggestions = await creative_service.suggest_creative(request.ingredients, request.query)
        return CreativeSuggestResponse(suggestions=suggestions)
    except NotImplementedError as e:
        raise _service_error(e)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
