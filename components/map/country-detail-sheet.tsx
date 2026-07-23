import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useQueries } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppBottomSheet } from '@/components/common';
import { StarRating } from '@/components/review';
import { queryKeys } from '@/constants/query-keys';
import type { CountryStat } from '@/hooks/use-map-data';
import { fetchMovieCredits } from '@/services/tmdb';
import { posterUrl } from '@/utils/image';

export function CountryDetailSheet({
  country,
  onClose,
}: {
  country: CountryStat | null;
  onClose: () => void;
}) {
  const snapPoints = useMemo(() => ['62%', '92%'], []);

  return (
    <AppBottomSheet
      index={country ? 0 : -1}
      snapPoints={snapPoints}
      onChange={(i) => {
        if (i === -1) onClose();
      }}>
      <BottomSheetScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        {country ? <SheetContent country={country} /> : null}
      </BottomSheetScrollView>
    </AppBottomSheet>
  );
}

function SheetContent({ country }: { country: CountryStat }) {
  // Lazily pull credits for this country's top films to derive favourite directors.
  const topMovieIds = useMemo(() => country.movies.slice(0, 8).map((m) => m.movieId), [country]);
  const creditQueries = useQueries({
    queries: topMovieIds.map((id) => ({
      queryKey: queryKeys.movieCredits(id),
      queryFn: () => fetchMovieCredits(id),
      staleTime: Infinity,
    })),
  });

  const directors = useMemo(() => {
    const counts = new Map<string, number>();
    creditQueries.forEach((q) => {
      const dir = q.data?.crew.find((c) => c.job === 'Director');
      if (dir) counts.set(dir.name, (counts.get(dir.name) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name]) => name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditQueries.map((q) => q.data?.id ?? 0).join(',')]);

  const topMovies = country.movies.slice(0, 12);

  return (
    <View className="gap-6">
      {/* header */}
      <View className="flex-row items-center gap-3">
        <Animated.Text entering={ZoomIn.duration(500)} style={{ fontSize: 44 }}>
          {country.flag}
        </Animated.Text>
        <View className="flex-1">
          <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">{country.name}</Text>
          <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
            {country.continent}
          </Text>
        </View>
      </View>

      {/* stats row */}
      <View className="flex-row gap-3">
        <StatBox label="Movies watched" value={String(country.moviesWatched)} />
        <StatBox
          label="Your average"
          value={country.averageRating > 0 ? `${country.averageRating.toFixed(1)}/5` : '—'}
        />
      </View>

      {country.averageRating > 0 ? (
        <View className="flex-row items-center gap-2">
          <StarRating rating={country.averageRating} size={18} />
          <Text className="text-sm font-semibold text-inkLight dark:text-ink">
            {country.averageRating.toFixed(1)}
          </Text>
        </View>
      ) : null}

      {/* favourite movies carousel */}
      <View className="gap-2.5">
        <Text className="text-sm font-bold text-inkLight dark:text-ink">Favourite movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {topMovies.map((movie) => {
            const uri = posterUrl(movie.posterPath, 'w342');
            return (
              <Pressable
                key={`${movie.movieId}-${movie.watchedDate}`}
                onPress={() => router.push(`/movie/${movie.movieId}`)}
                style={{ width: 104 }}>
                <View className="h-40 w-full overflow-hidden rounded-md bg-surface-light-soft dark:bg-base-soft">
                  {uri ? (
                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  ) : null}
                </View>
                <Text numberOfLines={1} className="mt-1.5 text-xs font-semibold text-inkLight dark:text-ink">
                  {movie.title}
                </Text>
                {movie.rating > 0 ? (
                  <View className="mt-0.5">
                    <StarRating rating={movie.rating} size={11} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* favourite directors */}
      {directors.length > 0 ? (
        <View className="gap-2">
          <Text className="text-sm font-bold text-inkLight dark:text-ink">Favourite directors</Text>
          <View className="flex-row flex-wrap gap-2">
            {directors.map((name) => (
              <View key={name} className="rounded-full bg-brand/15 px-3 py-1.5">
                <Text className="text-xs font-medium text-brand-dim dark:text-brand">{name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* personal note */}
      <View className="rounded-md bg-surface-light-soft p-3.5 dark:bg-base-soft">
        <Text className="text-xs leading-5 text-inkLight-muted dark:text-ink-muted">
          You first explored {country.name} cinema in{' '}
          {new Date(country.firstWatchedDate).getFullYear()}, and most recently in{' '}
          {new Date(country.lastWatchedDate).getFullYear()}.
        </Text>
      </View>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1 rounded-md bg-surface-light-soft py-3.5 dark:bg-base-soft">
      <Text className="text-xl font-extrabold text-inkLight dark:text-ink">{value}</Text>
      <Text className="text-[11px] text-inkLight-muted dark:text-ink-muted">{label}</Text>
    </View>
  );
}
