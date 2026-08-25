import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, shadow } from '../theme';
import type { Recipe } from '../types';

const DIFFICULTY_LABELS = ['', '简单', '容易', '中等', '较难', '困难'];

function nutritionColor(score: number): string {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.warning;
  return colors.textSecondary;
}

interface RecipeCardProps {
  recipe: Recipe;
  /** 排名序号 (服务端已排序) */
  rank: number;
}

/** AI 消息区块: 食谱卡片 (可展开查看步骤) */
export default function RecipeCard({ recipe, rank }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const stars = '★'.repeat(recipe.difficulty) + '☆'.repeat(5 - recipe.difficulty);
  const scoreColor = nutritionColor(recipe.nutrition_score);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {recipe.name}
        </Text>
        <View style={[styles.nutritionBadge, { backgroundColor: `${scoreColor}1A` }]}>
          <Text style={[styles.nutritionText, { color: scoreColor }]}>
            营养 {Math.round(recipe.nutrition_score)}
          </Text>
        </View>
      </View>

      {recipe.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>⏱ {recipe.time_minutes} 分钟</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>
          {DIFFICULTY_LABELS[recipe.difficulty] ?? '中等'}{' '}
          <Text style={styles.stars}>{stars}</Text>
        </Text>
      </View>

      <View style={styles.ingredientRow}>
        {recipe.ingredients.slice(0, 5).map((item) => (
          <View key={item} style={styles.ingChip}>
            <Text style={styles.ingText}>{item}</Text>
          </View>
        ))}
        {recipe.ingredients.length > 5 && (
          <View style={styles.ingChip}>
            <Text style={styles.ingText}>+{recipe.ingredients.length - 5}</Text>
          </View>
        )}
      </View>

      {expanded && (
        <View style={styles.steps}>
          <Text style={styles.stepsTitle}>做法步骤</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.6}
      >
        <Text style={styles.toggleText}>{expanded ? '收起步骤 ▴' : '查看步骤 ▾'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardWarm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardWarmBorder,
    padding: 12,
    ...shadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 8,
  },
  nutritionBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  nutritionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textLight,
  },
  stars: {
    color: colors.star,
    fontSize: 11,
  },
  ingredientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  ingChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ingText: {
    fontSize: 12,
    color: colors.primaryDark,
  },
  steps: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cardWarmBorder,
    paddingTop: 10,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },
  toggle: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
