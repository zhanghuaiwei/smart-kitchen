import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, shadow } from '../theme';

const QUICK_PROMPTS = [
  '番茄和鸡蛋能做什么菜?',
  '推荐一道 15 分钟的快手晚餐',
  '低脂又饱腹的搭配有哪些?',
  '冰箱里只剩鸡蛋怎么办?',
];

/** 空会话时的欢迎引导 */
export default function WelcomeSection({ onQuickPrompt }: { onQuickPrompt: (text: string) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🍳</Text>
      <Text style={styles.title}>你好, 我是你的私厨管家</Text>
      <Text style={styles.subtitle}>
        拍一张冰箱或食材的照片发给我, 我来帮你识别食材、推荐食谱、想想今天吃什么
      </Text>
      <View style={styles.chips}>
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={styles.chip}
            onPress={() => onQuickPrompt(prompt)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  chip: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  chipText: {
    fontSize: 13,
    color: colors.primaryDark,
  },
});
