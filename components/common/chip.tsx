import React from 'react';
import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={[
        'rounded-full border px-4 py-2',
        selected
          ? 'border-brand bg-brand'
          : 'border-surface-light-border bg-surface-light-soft dark:border-base-border dark:bg-base-soft',
      ].join(' ')}>
      <Text
        className={[
          'text-sm font-medium',
          selected ? 'text-black' : 'text-inkLight-muted dark:text-ink-muted',
        ].join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
}
