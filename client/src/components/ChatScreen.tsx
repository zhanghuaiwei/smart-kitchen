import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';
import { colors, radii, shadow } from '../theme';
import type { ChatMessage } from '../types';
import InputBar, { PendingImage } from './InputBar';
import MessageBubble from './MessageBubble';
import SettingsModal from './SettingsModal';
import WelcomeSection from './WelcomeSection';

/** 主界面: 顶栏 + 消息列表 + 输入栏 */
export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { messages, isTyping, sendMessage, clearMessages } = useChat();
  const { apiBaseUrl, updateApiBaseUrl } = useSettings();
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // 新消息 / 键盘弹出时滚动到底部
  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages, isTyping]);

  const pickImage = useCallback(async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('需要权限', fromCamera ? '请在系统设置中允许访问相机' : '请在系统设置中允许访问相册');
      return;
    }
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    };
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        setPendingImage({ uri: asset.uri, base64: asset.base64 });
      }
    }
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text && !pendingImage) return;
    const image = pendingImage;
    setInput('');
    setPendingImage(null);
    await sendMessage(text, image);
  }, [input, pendingImage, sendMessage]);

  const handleClear = () => {
    Alert.alert('清空对话', '确定要清空所有对话记录吗?', [
      { text: '取消', style: 'cancel' },
      { text: '清空', style: 'destructive', onPress: clearMessages },
    ]);
  };

  // "正在输入"占位消息
  const data: ChatMessage[] = isTyping
    ? [...messages, { id: '__typing__', role: 'assistant', content: '', createdAt: 0, typing: true }]
    : messages;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* 顶栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🍳</Text>
          </View>
          <View>
            <Text style={styles.title}>AI 私厨管家</Text>
            <Text style={styles.subtitle}>食材识别 · 食谱推荐 · 创意搭配</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleClear} style={styles.headerBtn} activeOpacity={0.6}>
            <Text style={styles.headerBtnText}>🧹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSettingsVisible(true)}
            style={styles.headerBtn}
            activeOpacity={0.6}
          >
            <Text style={styles.headerBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 消息列表 + 输入栏 */}
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<WelcomeSection onQuickPrompt={setInput} />}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
        <InputBar
          value={input}
          onChangeText={setInput}
          pendingImage={pendingImage}
          onPickCamera={() => pickImage(true)}
          onPickGallery={() => pickImage(false)}
          onRemoveImage={() => setPendingImage(null)}
          onSend={handleSend}
          disabled={isTyping}
        />
        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>

      <SettingsModal
        visible={settingsVisible}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setSettingsVisible(false)}
        onSave={updateApiBaseUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerBtnText: {
    fontSize: 15,
  },
  body: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 8,
  },
});
