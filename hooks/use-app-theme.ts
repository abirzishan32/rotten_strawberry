import { useColorScheme } from 'nativewind';

import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store/theme-store';

/**
 * Resolves the active color scheme (system-detected or manually overridden
 * via NativeWind's `colorScheme.set`) and returns the matching hex token
 * set for use outside `className` — icon `color` props, navigation theme,
 * status bar style, gradients, blur tint.
 */
export function useAppTheme() {
  const { colorScheme } = useColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  const scheme = colorScheme ?? 'dark';
  const isDark = scheme === 'dark';

  return {
    scheme,
    isDark,
    colors: Colors[scheme],
    preference,
    setPreference,
  };
}
