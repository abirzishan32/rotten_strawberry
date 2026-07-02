import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/button';
import { useAppTheme } from '@/hooks/use-app-theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'film-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 items-center justify-center gap-3 px-10 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-light-soft dark:bg-base-soft">
        <Ionicons name={icon} size={28} color={colors.textFaint} />
      </View>
      <Text className="text-center text-base font-semibold text-inkLight dark:text-ink">
        {title}
      </Text>
      {message ? (
        <Text className="text-center text-sm text-inkLight-muted dark:text-ink-muted">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-2">
          <Button label={actionLabel} variant="secondary" size="sm" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
