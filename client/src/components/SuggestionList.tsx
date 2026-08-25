import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

/** AI 消息区块: 创意搭配建议 */
export default function SuggestionList({ suggestions }: { suggestions: string[] }) {
  if (suggestions.length === 0) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>💡 创意搭配建议</Text>
      {suggestions.map((text, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.index}>
            <Text style={styles.indexText}>{index + 1}</Text>
          </View>
          <Text style={styles.text}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.warningBg,
    borderRadius: radii.md,
    padding: 10,
    marginBottom: 8,
  },
  index: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
});
