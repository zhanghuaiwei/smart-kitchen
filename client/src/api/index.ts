/** 服务端 API 客户端 */
import { getApiBaseUrl, normalizeUrl } from '../config';
import type { ChatHistoryItem, ChatResponse } from '../types';

const REQUEST_TIMEOUT_MS = 30000;

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      let detail = `请求失败 (HTTP ${response.status})`;
      try {
        const body = await response.json();
        if (body?.detail) {
          detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail);
        }
      } catch {
        // 非 JSON 响应, 使用默认提示
      }
      throw new ApiError(detail, response.status);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('请求超时, 请检查网络或服务端地址');
    }
    throw new ApiError('无法连接服务端, 请检查地址配置');
  } finally {
    clearTimeout(timer);
  }
}

/** 发送对话消息 (文本 + 可选图片), 服务端编排: 识别 → 搜索 → 排序/创意建议 */
export function sendChat(params: {
  message: string;
  imageBase64?: string;
  history: ChatHistoryItem[];
}): Promise<ChatResponse> {
  return request<ChatResponse>('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/** 健康检查 (设置页"测试连接"), 可传入待测试地址 */
export async function checkHealth(baseUrl?: string): Promise<void> {
  const base = normalizeUrl(baseUrl ?? getApiBaseUrl());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${base}/health`, { signal: controller.signal });
    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}`, response.status);
    }
  } finally {
    clearTimeout(timer);
  }
}
