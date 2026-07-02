import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { formatRating } from '@/utils/format';

interface RatingBadgeProps {
  voteAverage: number | null | undefined;
  size?: 'sm' | 'md';
}

export function RatingBadge({ voteAverage, size = 'sm' }: RatingBadgeProps) {
  const iconSize = size === 'sm' ? 11 : 14;
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <View className="flex-row items-center gap-1 rounded-xs bg-black/70 px-1.5 py-0.5">
      <Ionicons name="star" size={iconSize} color="#ff8000" />
      <Text className={['font-semibold text-white', textClass].join(' ')}>
        {formatRating(voteAverage)}
      </Text>
    </View>
  );
}
