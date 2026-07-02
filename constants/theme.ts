/**
 * Semantic color tokens for contexts that can't use NativeWind `className`
 * (icon `color` props, React Navigation's theme, status bar, gradients, blur
 * tint). These hex values are kept in sync with `tailwind.config.js`.
 */
import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#ffffff',
    backgroundSoft: '#f4f5f7',
    backgroundElevated: '#ffffff',
    border: '#e4e6eb',
    text: '#14171b',
    textMuted: '#5b6472',
    textFaint: '#8a919c',
    tint: '#00b845',
    icon: '#5b6472',
    tabIconDefault: '#8a919c',
    tabIconSelected: '#00b845',
  },
  dark: {
    background: '#0e1013',
    backgroundSoft: '#14171b',
    backgroundElevated: '#1c2027',
    border: '#262b33',
    text: '#eef1f5',
    textMuted: '#9aa3af',
    textFaint: '#5b6472',
    tint: '#00e054',
    icon: '#9aa3af',
    tabIconDefault: '#5b6472',
    tabIconSelected: '#00e054',
  },
} as const;

export const BrandColors = {
  green: '#00e054',
  greenDim: '#00b845',
  orange: '#ff8000',
  blue: '#40bcf4',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})!;
