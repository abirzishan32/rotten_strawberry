import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, LoadingSpinner } from '@/components/common';
import { ReviewCard } from '@/components/review';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useRecentReviews } from '@/hooks/queries';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { data: reviews, isLoading, refetch } = useRecentReviews();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="px-4 pb-3">
        <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Activity</Text>
        <Text className="mt-1 text-sm text-inkLight-muted dark:text-ink-muted">
          Recent public reviews from the community
        </Text>
      </View>

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState
          icon="pulse-outline"
          title="No activity yet"
          message="Public reviews from the community will show up here. Be the first to log a film!"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
          }
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: insets.bottom + 110 }}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              entry={review}
              authorName={review.author?.username ?? review.author?.displayName ?? undefined}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
