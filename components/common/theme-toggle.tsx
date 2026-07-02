import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { ThemePreference } from '@/store/theme-store';

const OPTIONS: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'system', label: 'Auto', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export function ThemeToggle() {
  const { preference, setPreference, colors } = useAppTheme();

  return (
    <View className="flex-row rounded-sm bg-surface-light-soft p-1 dark:bg-base-soft">
      {OPTIONS.map((option) => {
        const active = option.value === preference;
        return (
          <Pressable
            key={option.value}
            onPress={() => setPreference(option.value)}
            className={[
              'flex-1 flex-row items-center justify-center gap-1.5 rounded-xs py-2.5',
              active ? 'bg-white dark:bg-base-elevated' : '',
            ].join(' ')}>
            <Ionicons name={option.icon} size={15} color={active ? colors.tint : colors.textMuted} />
            <Text
              className={[
                'text-xs font-medium',
                active ? 'text-inkLight dark:text-ink' : 'text-inkLight-muted dark:text-ink-muted',
              ].join(' ')}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
