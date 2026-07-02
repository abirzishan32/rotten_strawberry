import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

import { RatingBadge } from '@/components/movie/rating-badge';
import type { TmdbMovieSummary } from '@/types';
import { releaseYear } from '@/utils/format';
import { backdropUrl } from '@/utils/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = SCREEN_WIDTH * 1.25;

interface FeaturedBannerProps {
  movie: TmdbMovieSummary;
}

export function FeaturedBanner({ movie }: FeaturedBannerProps) {
  return (
    <Pressable
      onPress={() => router.push(`/movie/${movie.id}`)}
      style={{ height: BANNER_HEIGHT }}
      className="w-full overflow-hidden">
      <Image
        source={{ uri: backdropUrl(movie.backdrop_path) ?? undefined }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={250}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(14,16,19,0.95)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="absolute bottom-0 left-0 right-0 gap-2 p-5">
        <View className="flex-row items-center gap-2">
          <RatingBadge voteAverage={movie.vote_average} size="md" />
          <Text className="text-xs font-medium text-white/80">
            {releaseYear(movie.release_date)}
          </Text>
        </View>
        <Text numberOfLines={2} className="text-3xl font-extrabold text-white">
          {movie.title}
        </Text>
        <Text numberOfLines={2} className="text-sm text-white/70">
          {movie.overview}
        </Text>
        <View className="mt-2 flex-row items-center gap-1.5">
          <Ionicons name="play-circle" size={18} color="#00e054" />
          <Text className="text-sm font-semibold text-brand">View details</Text>
        </View>
      </View>
    </Pressable>
  );
}
