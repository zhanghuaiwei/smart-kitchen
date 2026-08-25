import { useCallback, useRef, useState } from 'react';
import { sendChat } from '../api';
import type { ChatHistoryItem, ChatMessage, ChatResponse } from '../types';

const HISTORY_LIMIT = 10;

export interface PendingImagePayload {
  /** 本地预览地址 */
  uri: string;
  /** 发送给服务端的 base64 内容 */
  base64: string;
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 图片消息无文本时, 用识别结果合成上下文文本, 便于服务端理解对话历史 */
function toHistoryText(message: ChatMessage): string {
  if (message.content) return message.content;
  if (message.ingredients && message.ingredients.length > 0) {
    return `(上传图片, 识别到食材: ${message.ingredients.map((i) => i.name).join('、')})`;
  }
  return '';
}

/** 聊天状态管理: 消息列表 / 发送 / 加载中 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  const isTypingRef = useRef(false);

  const appendMessage = useCallback((message: ChatMessage) => {
    messagesRef.current = [...messagesRef.current, message];
    setMessages(messagesRef.current);
  }, []);

  const sendMessage = useCallback(
    async (text: string, image?: PendingImagePayload | null) => {
      if (isTypingRef.current) return;

      // 组装对话历史 (最近 N 条, 仅文本)
      const history: ChatHistoryItem[] = messagesRef.current
        .filter(
          (m): m is ChatMessage & { role: 'user' | 'assistant' } =>
            m.role === 'user' || m.role === 'assistant',
        )
        .slice(-HISTORY_LIMIT)
        .map((m) => ({ role: m.role, content: toHistoryText(m) }))
        .filter((m) => m.content.length > 0);

      appendMessage({
        id: genId(),
        role: 'user',
        content: text,
        imageUri: image?.uri,
        createdAt: Date.now(),
      });

      isTypingRef.current = true;
      setIsTyping(true);
      try {
        const response: ChatResponse = await sendChat({
          message: text,
          imageBase64: image?.base64,
          history,
        });
        appendMessage({
          id: genId(),
          role: 'assistant',
          content: response.reply,
          ingredients: response.ingredients,
          recipes: response.recipes,
          creativeSuggestions: response.creative_suggestions,
          createdAt: Date.now(),
        });
      } catch (error) {
        appendMessage({
          id: genId(),
          role: 'error',
          content: error instanceof Error ? error.message : '请求失败, 请稍后重试',
          createdAt: Date.now(),
        });
      } finally {
        isTypingRef.current = false;
        setIsTyping(false);
      }
    },
    [appendMessage],
  );

  const clearMessages = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
  }, []);

  return { messages, isTyping, sendMessage, clearMessages };
}
