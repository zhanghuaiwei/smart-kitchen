/** 数据类型 - 与服务端 schemas.py 保持一致 */

export interface Ingredient {
  name: string;
  confidence: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  nutrition_score: number;
  difficulty: number;
  time_minutes: number;
  tags: string[];
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  ingredients: Ingredient[];
  recipes: Recipe[];
  creative_suggestions: string[];
}

export type MessageRole = 'user' | 'assistant' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  /** 用户消息: 本地图片预览地址 */
  imageUri?: string;
  /** AI 消息: 识别出的食材 */
  ingredients?: Ingredient[];
  /** AI 消息: 推荐食谱 (已排序) */
  recipes?: Recipe[];
  /** AI 消息: 创意搭配建议 */
  creativeSuggestions?: string[];
  /** 是否为"正在输入"占位消息 */
  typing?: boolean;
}
