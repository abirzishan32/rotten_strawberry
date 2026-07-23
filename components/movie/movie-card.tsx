import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { RatingBadge } from '@/components/movie/rating-badge';
import type { TmdbMovieSummary } from '@/types';
import { posterUrl } from '@/utils/image';
import { releaseYear } from '@/utils/format';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MovieCardProps {
  movie: TmdbMovieSummary;
  width?: number;
  /** Override the default tap behaviour (navigate to the movie detail). Used by
   *  pickers (add-log, favourite films) that select the movie instead. */
  onPress?: () => void;
}

export function MovieCard({ movie, width = 128, onPress }: MovieCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const height = width * 1.5;

  return (
    <AnimatedPressable
      style={[{ width }, animatedStyle]}
      onPressIn={() => (scale.value = withTiming(0.95, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
      onPress={onPress ?? (() => router.push(`/movie/${movie.id}`))}
      accessibilityRole="button"
      accessibilityLabel={movie.title}>
      <View style={{ height }} className="overflow-hidden rounded-md bg-surface-light-soft dark:bg-base-soft">
        <Image
          source={{ uri: posterUrl(movie.poster_path) ?? undefined }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
        <View className="absolute bottom-1.5 left-1.5">
          <RatingBadge voteAverage={movie.vote_average} />
        </View>
      </View>
      <Text
        numberOfLines={1}
        className="mt-2 text-sm font-semibold text-inkLight dark:text-ink">
        {movie.title}
      </Text>
      <Text className="text-xs text-inkLight-muted dark:text-ink-muted">
        {releaseYear(movie.release_date)}
      </Text>
    </AnimatedPressable>
  );
}
