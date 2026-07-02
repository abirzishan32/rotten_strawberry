import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/common';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="px-4 pb-3">
        <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Activity</Text>
        <Text className="mt-1 text-sm text-inkLight-muted dark:text-ink-muted">
          Reviews, likes, and follows from people you follow
        </Text>
      </View>
      <EmptyState
        icon="pulse-outline"
        title="No activity yet"
        message="Follow other members to see their reviews and ratings show up here."
      />
    </View>
  );
}
