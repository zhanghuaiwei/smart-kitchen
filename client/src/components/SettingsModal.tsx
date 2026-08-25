import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { checkHealth } from '../api';
import { colors, radii } from '../theme';

interface SettingsModalProps {
  visible: boolean;
  apiBaseUrl: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

/** 设置页 (底部弹层): 服务端地址配置 + 连接测试 */
export default function SettingsModal({ visible, apiBaseUrl, onClose, onSave }: SettingsModalProps) {
  const [url, setUrl] = useState(apiBaseUrl);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // 每次打开时同步最新地址
  useEffect(() => {
    if (visible) {
      setUrl(apiBaseUrl);
      setTestMsg(null);
    }
  }, [visible, apiBaseUrl]);

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestMsg(null);
    try {
      await checkHealth(url.trim());
      setTestMsg({ ok: true, text: '连接成功' });
    } catch {
      setTestMsg({ ok: false, text: '连接失败, 请检查服务端是否已启动' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const normalized = url.trim().replace(/\/+$/, '');
    if (!normalized) {
      Alert.alert('提示', '请输入服务端地址');
      return;
    }
    if (!/^https?:\/\//.test(normalized)) {
      Alert.alert('提示', '地址需以 http:// 或 https:// 开头');
      return;
    }
    onSave(normalized);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>设置</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>服务端地址</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="http://192.168.1.100:8000"
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <Text style={styles.tip}>
            提示: 模拟器可用 http://localhost:8000; 真机调试请改为电脑的局域网 IP
          </Text>

          {testMsg && (
            <Text style={[styles.testMsg, { color: testMsg.ok ? colors.success : colors.error }]}>
              {testMsg.ok ? '✓ ' : '✕ '}
              {testMsg.text}
            </Text>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost]}
              onPress={handleTest}
              disabled={testing}
              activeOpacity={0.7}
            >
              {testing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.btnGhostText}>测试连接</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={styles.btnPrimaryText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl + 4,
    borderTopRightRadius: radii.xl + 4,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  close: {
    fontSize: 16,
    color: colors.textSecondary,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  tip: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
    marginTop: 8,
  },
  testMsg: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: colors.primaryLight,
  },
  btnGhostText: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
