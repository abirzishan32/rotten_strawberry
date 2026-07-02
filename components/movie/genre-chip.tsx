import React from 'react';
import { Text, View } from 'react-native';

export function GenreChip({ name }: { name: string }) {
  return (
    <View className="rounded-full border border-surface-light-border bg-surface-light-soft px-3 py-1.5 dark:border-base-border dark:bg-base-soft">
      <Text className="text-xs font-medium text-inkLight-muted dark:text-ink-muted">{name}</Text>
    </View>
  );
}
