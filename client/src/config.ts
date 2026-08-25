/** 客户端配置: 服务端地址管理 (持久化到 AsyncStorage) */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_API_BASE_URL = 'smart-kitchen.api-base-url';

/** 默认服务端地址 (模拟器可用 localhost; 真机请改为电脑局域网 IP, 可在设置页修改) */
export const DEFAULT_API_BASE_URL = 'http://localhost:8000';

let apiBaseUrl = DEFAULT_API_BASE_URL;

export function getApiBaseUrl(): string {
  return apiBaseUrl;
}

export function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

export function setApiBaseUrl(url: string): void {
  apiBaseUrl = normalizeUrl(url);
}

/** 启动时从本地存储恢复地址 */
export async function loadApiBaseUrl(): Promise<string> {
  try {
    const saved = await AsyncStorage.getItem(KEY_API_BASE_URL);
    if (saved) {
      apiBaseUrl = normalizeUrl(saved);
    }
  } catch {
    // 读取失败时回退默认地址
  }
  return apiBaseUrl;
}

/** 保存地址 (设置页"保存"时调用) */
export async function persistApiBaseUrl(url: string): Promise<void> {
  const normalized = normalizeUrl(url);
  apiBaseUrl = normalized;
  await AsyncStorage.setItem(KEY_API_BASE_URL, normalized);
}
