import React from 'react';
import { Text, View } from 'react-native';

import { REVIEW_METRICS, type MovieLogEntry } from '@/types';

/**
 * Compact breakdown of a review's four rating metrics (Movie / Ending /
 * Rewatchability / Pacing). Only renders the metrics that were actually scored.
 */
export function ReviewMetrics({
  entry,
  includeMovie = false,
}: {
  entry: MovieLogEntry;
  includeMovie?: boolean;
}) {
  const metrics = REVIEW_METRICS.filter((m) => {
    if (m.key === 'rating' && !includeMovie) return false;
    return entry[m.key] > 0;
  });
  if (metrics.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-x-3 gap-y-1">
      {metrics.map((m) => (
        <View key={m.key} className="flex-row items-center gap-1">
          <Text className="text-[11px] text-inkLight-muted dark:text-ink-muted">{m.label}</Text>
          <Text className="text-[11px] font-semibold text-brand-dim dark:text-brand">
            {entry[m.key].toFixed(1).replace(/\.0$/, '')}
          </Text>
        </View>
      ))}
    </View>
  );
}
