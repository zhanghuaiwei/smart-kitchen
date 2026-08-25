import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_API_BASE_URL, loadApiBaseUrl, normalizeUrl, persistApiBaseUrl } from '../config';

/** 服务端地址配置 (持久化到 AsyncStorage) */
export function useSettings() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadApiBaseUrl()
      .then(setApiBaseUrl)
      .finally(() => setLoaded(true));
  }, []);

  const updateApiBaseUrl = useCallback(async (url: string) => {
    await persistApiBaseUrl(url);
    setApiBaseUrl(normalizeUrl(url));
  }, []);

  return { apiBaseUrl, loaded, updateApiBaseUrl };
}
