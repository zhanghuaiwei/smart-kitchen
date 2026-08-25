"""对话编排服务 (核心功能 5: 对话交互)

完整流程已实现: 图片识别 → 食谱搜索 → 智能排序 / 创意建议 → 回复文案生成。
各环节核心逻辑位于对应 service 中 (TODO 占位, 待人工实现)。
"""
from typing import List

from schemas import ChatRequest, ChatResponse, Ingredient, Recipe
from services import creative_service, recipe_service, vision_service
from tools.image_utils import check_image_size, decode_base64_image


async def handle_chat(request: ChatRequest) -> ChatResponse:
    """处理一次对话请求: 识别 → 搜索 → 排序/创意 → 生成回复"""
    ingredients: List[Ingredient] = []

    # 1. 图片识别 (携带图片时)
    if request.image_base64:
        image_bytes = decode_base64_image(request.image_base64)
        check_image_size(image_bytes)
        ingredients = await vision_service.recognize_ingredients(image_bytes)

    ingredient_names = [i.name for i in ingredients]

    # 2. 食谱搜索 (基于识别出的食材 + 用户文本)
    recipes = await recipe_service.search_recipes(ingredient_names, request.message or None)

    # 3. 有结果 → 智能排序; 无结果 → 创意建议
    suggestions: List[str] = []
    if recipes:
        recipes = await recipe_service.rank_recipes(recipes, preference=request.message or None)
    else:
        suggestions = await creative_service.suggest_creative(
            ingredient_names, request.message or None
        )

    # 4. 生成回复文案 (当前为模板文案; 也可改为调用对话模型,
    #    结合 request.history 生成更自然的回复, 属可选项)
    reply = build_reply_text(ingredients, recipes, suggestions)
    return ChatResponse(
        reply=reply,
        ingredients=ingredients,
        recipes=recipes,
        creative_suggestions=suggestions,
    )


def build_reply_text(
    ingredients: List[Ingredient],
    recipes: List[Recipe],
    suggestions: List[str],
) -> str:
    """根据结构化结果生成回复文案"""
    if ingredients:
        names = "、".join(i.name for i in ingredients)
        prefix = f"我在图片里识别到了这些食材: {names}。"
    else:
        prefix = ""

    if recipes:
        return prefix + f"为你找到了 {len(recipes)} 道合适的食谱, 已按营养价值和制作难度排好序, 看看哪道合口味~"
    if suggestions:
        return prefix + "暂时没有找到完全匹配的食谱, 我为你想了几个创意搭配, 或许能带来灵感~"
    return "拍一张冰箱或食材的照片发给我, 我来帮你想想今天吃什么~"
