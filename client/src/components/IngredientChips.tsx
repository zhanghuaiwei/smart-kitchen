import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';
import type { Ingredient } from '../types';

/** AI 消息区块: 识别到的食材标签 */
export default function IngredientChips({ ingredients }: { ingredients: Ingredient[] }) {
  if (ingredients.length === 0) return null;
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>🔍 识别到的食材</Text>
      <View style={styles.chips}>
        {ingredients.map((item) => (
          <View key={item.name} style={styles.chip}>
            <Text style={styles.chipName}>{item.name}</Text>
            <Text style={styles.chipConf}>{Math.round(item.confidence * 100)}%</Text>
          </View>
        ))}
      </View>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primaryDark,
  },
  chipConf: {
    fontSize: 11,
    color: '#CE8B5C',
  },
});
