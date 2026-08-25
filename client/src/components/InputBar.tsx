import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, radii } from '../theme';
import PendingImagePreview from './PendingImagePreview';

export interface PendingImage {
  uri: string;
  base64: string;
}

interface InputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  pendingImage: PendingImage | null;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onRemoveImage: () => void;
  onSend: () => void;
  /** AI 处理中, 禁止发送 */
  disabled?: boolean;
}

/** 底部输入栏: 相机/相册 + 文本输入 + 发送 */
export default function InputBar({
  value,
  onChangeText,
  pendingImage,
  onPickCamera,
  onPickGallery,
  onRemoveImage,
  onSend,
  disabled,
}: InputBarProps) {
  const canSend = (value.trim().length > 0 || pendingImage !== null) && !disabled;

  return (
    <View style={styles.container}>
      {pendingImage && <PendingImagePreview image={pendingImage} onRemove={onRemoveImage} />}
      <View style={styles.row}>
        <TouchableOpacity style={styles.iconBtn} onPress={onPickCamera} activeOpacity={0.6}>
          <Text style={styles.icon}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onPickGallery} activeOpacity={0.6}>
          <Text style={styles.icon}>🖼️</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="描述食材或想吃点什么…"
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !canSend ? styles.sendBtnDisabled : null]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  icon: {
    fontSize: 17,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 9,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.sendDisabled,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginTop: -2,
  },
});
