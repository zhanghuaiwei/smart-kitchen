/** 主题配置: 暖色系厨房风格 */
export const colors = {
  primary: '#E86A33',        // 主色: 暖橙
  primaryDark: '#D0521F',
  primaryLight: '#FDEEE4',   // 主色浅底
  background: '#FAF8F5',     // 页面背景: 暖白
  card: '#FFFFFF',
  cardWarm: '#FFFCF9',       // 卡片暖底
  cardWarmBorder: '#F3E7DB',
  border: '#EFE9E2',
  text: '#2D2A26',
  textSecondary: '#8A8580',
  textLight: '#B8B2AA',
  aiBubble: '#FFFFFF',
  error: '#D9480F',
  errorBg: '#FFF0EA',
  success: '#2F9E44',
  warning: '#E8890C',
  warningBg: '#FFF6E7',
  star: '#F5A623',
  sendDisabled: '#E7DFD6',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };

export const radii = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
} as const;
