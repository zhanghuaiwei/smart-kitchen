import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

/** AI 正在输入的动画指示器 (三个点渐次点亮) */
export default function TypingIndicator() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [progress]);

  const opacityFor = (start: number) =>
    progress.interpolate({
      inputRange: [start, start + 0.18, start + 0.4],
      outputRange: [0.3, 1, 0.3],
    });

  return (
    <View style={styles.row}>
      {[0, 0.3, 0.6].map((start, index) => (
        <Animated.View key={index} style={[styles.dot, { opacity: opacityFor(start) }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
