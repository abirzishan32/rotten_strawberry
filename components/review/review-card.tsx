import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ReviewMetrics } from '@/components/review/review-metrics';
import { StarRating } from '@/components/review/star-rating';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { MovieLogEntry } from '@/types';
import { formatDate } from '@/utils/format';
import { posterUrl } from '@/utils/image';

export function ReviewCard({ entry, authorName }: { entry: MovieLogEntry; authorName?: string }) {
  const { colors } = useAppTheme();
  const [revealed, setRevealed] = useState(!entry.containsSpoilers);
  const uri = posterUrl(entry.posterPath, 'w185');

  return (
    <View className="flex-row gap-3 rounded-md bg-surface-light-soft p-3 dark:bg-base-soft">
      <View className="h-24 w-16 overflow-hidden rounded-sm bg-surface-light-border dark:bg-base-elevated">
        {uri ? <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" /> : null}
      </View>
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-sm font-semibold text-inkLight dark:text-ink" numberOfLines={1}>
            {entry.movieTitle}
          </Text>
          {entry.liked ? <Ionicons name="heart" size={14} color="#ff8000" /> : null}
        </View>
        <View className="flex-row items-center gap-2">
          <StarRating rating={entry.rating} size={13} />
          <Text className="text-[11px] text-inkLight-muted dark:text-ink-muted">
            {formatDate(entry.watchedDate)}
          </Text>
        </View>
        {authorName ? (
          <Text className="text-[11px] font-medium text-brand-dim dark:text-brand">@{authorName}</Text>
        ) : null}
        <ReviewMetrics entry={entry} />
        {entry.reviewText ? (
          revealed ? (
            <Text className="text-xs leading-4 text-inkLight-muted dark:text-ink-muted" numberOfLines={4}>
              {entry.reviewText}
            </Text>
          ) : (
            <Pressable
              onPress={() => setRevealed(true)}
              className="flex-row items-center gap-1.5 rounded-xs bg-black/5 px-2 py-1.5 dark:bg-white/5">
              <Ionicons name="eye-off-outline" size={13} color={colors.textMuted} />
              <Text className="text-[11px] font-medium text-inkLight-muted dark:text-ink-muted">
                Contains spoilers — tap to reveal
              </Text>
            </Pressable>
          )
        ) : null}
        {entry.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-1.5 pt-0.5">
            {entry.tags.map((tag) => (
              <Text
                key={tag}
                className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-inkLight-muted dark:bg-white/5 dark:text-ink-muted">
                #{tag}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
