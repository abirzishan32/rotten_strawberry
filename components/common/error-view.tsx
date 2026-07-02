import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/button';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = 'Something went wrong while loading this.',
  onRetry,
}: ErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-10 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <Ionicons name="alert-circle-outline" size={28} color="#ef4444" />
      </View>
      <Text className="text-center text-base font-semibold text-inkLight dark:text-ink">
        Couldn&apos;t load content
      </Text>
      <Text className="text-center text-sm text-inkLight-muted dark:text-ink-muted">
        {message}
      </Text>
      {onRetry ? (
        <View className="mt-2">
          <Button label="Retry" variant="secondary" size="sm" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
