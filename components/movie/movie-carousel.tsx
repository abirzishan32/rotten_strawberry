import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { CarouselSkeleton } from '@/components/common/skeleton';
import { MovieCard } from '@/components/movie/movie-card';
import type { MovieListCategory, TmdbMovieSummary } from '@/types';

interface MovieCarouselProps {
  title: string;
  movies: TmdbMovieSummary[] | undefined;
  isLoading?: boolean;
  category?: MovieListCategory;
}

export function MovieCarousel({ title, movies, isLoading, category }: MovieCarouselProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-4">
        <Text className="text-lg font-bold text-inkLight dark:text-ink">{title}</Text>
        {category ? (
          <Pressable onPress={() => router.push(`/browse/${category}`)} hitSlop={8}>
            <Text className="text-xs font-semibold text-brand-dim dark:text-brand">See all</Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <CarouselSkeleton />
      ) : (
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
          renderItem={({ item }) => <MovieCard movie={item} />}
        />
      )}
    </View>
  );
}
