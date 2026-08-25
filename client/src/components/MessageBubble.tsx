import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow } from '../theme';
import type { ChatMessage } from '../types';
import IngredientChips from './IngredientChips';
import RecipeCard from './RecipeCard';
import SuggestionList from './SuggestionList';
import TypingIndicator from './TypingIndicator';

/** 单条消息气泡: 用户(右侧) / AI(左侧, 可含食材/食谱/创意建议区块) / 错误(居中) */
export default function MessageBubble({ message }: { message: ChatMessage }) {
  // "正在输入"占位
  if (message.typing) {
    return (
      <View style={styles.aiRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🍳</Text>
        </View>
        <View style={styles.typingBubble}>
          <TypingIndicator />
        </View>
      </View>
    );
  }

  // 错误提示
  if (message.role === 'error') {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>⚠️ {message.content}</Text>
      </View>
    );
  }

  // 用户消息
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userColumn}>
          {message.imageUri ? (
            <Image source={{ uri: message.imageUri }} style={styles.image} />
          ) : null}
          {message.content ? (
            <View style={[styles.userBubble, message.imageUri ? styles.userBubbleWithImage : null]}>
              <Text style={styles.userText}>{message.content}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  // AI 消息: 文本 + 可选区块(食材/食谱/创意建议)
  return (
    <View style={styles.aiRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🍳</Text>
      </View>
      <View style={styles.aiBubble}>
        {message.content ? <Text style={styles.aiText}>{message.content}</Text> : null}
        {message.ingredients && message.ingredients.length > 0 && (
          <IngredientChips ingredients={message.ingredients} />
        )}
        {message.recipes && message.recipes.length > 0 && (
          <View style={styles.recipes}>
            {message.recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} rank={index + 1} />
            ))}
          </View>
        )}
        {message.creativeSuggestions && message.creativeSuggestions.length > 0 && (
          <SuggestionList suggestions={message.creativeSuggestions} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ---- AI 消息 ----
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: colors.aiBubble,
    borderRadius: radii.lg,
    borderTopLeftRadius: 4,
    padding: 12,
    gap: 10,
    ...shadow,
  },
  aiText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  recipes: {
    gap: 10,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: colors.aiBubble,
    borderRadius: radii.lg,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadow,
  },
  // ---- 用户消息 ----
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  userColumn: {
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubbleWithImage: {
    marginTop: 6,
  },
  userText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  image: {
    width: 220,
    aspectRatio: 4 / 3,
    borderRadius: radii.md,
  },
  // ---- 错误 ----
  errorWrap: {
    alignSelf: 'center',
    backgroundColor: colors.errorBg,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
    maxWidth: '90%',
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
  },
});
