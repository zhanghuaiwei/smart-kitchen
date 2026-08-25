import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii } from '../theme';

interface PendingImagePreviewProps {
  image: { uri: string };
  onRemove: () => void;
}

/** 输入栏上方: 待发送图片的预览条 */
export default function PendingImagePreview({ image, onRemove }: PendingImagePreviewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image.uri }} style={styles.thumb} />
      <Text style={styles.hint}>将识别图中食材</Text>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn} activeOpacity={0.6}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm + 2,
  },
  hint: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
