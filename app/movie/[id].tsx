import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, ErrorView, LoadingSpinner } from '@/components/common';
import { CastCard, GenreChip, MovieCarousel, RatingBadge } from '@/components/movie';
import { useAppTheme } from '@/hooks/use-app-theme';
import {
  useMovieCredits,
  useMovieDetails,
  useMovieRecommendations,
  useMovieVideos,
  useSimilarMovies,
} from '@/hooks/queries';
import { useFavoritesStore } from '@/store/favorites-store';
import { formatCurrency, formatDate, formatRating, formatRuntime, releaseYear } from '@/utils/format';
import { backdropUrl, posterUrl } from '@/utils/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BACKDROP_HEIGHT = SCREEN_WIDTH * 0.62;

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const details = useMovieDetails(movieId);
  const credits = useMovieCredits(movieId);
  const videos = useMovieVideos(movieId);
  const similar = useSimilarMovies(movieId);
  const recommendations = useMovieRecommendations(movieId);

  const isFavorite = useFavoritesStore((s) => s.isFavorite(movieId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickyHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [BACKDROP_HEIGHT - 90, BACKDROP_HEIGHT - 20], [0, 1], 'clamp'),
  }));

  const director = useMemo(
    () => credits.data?.crew.find((member) => member.job === 'Director'),
    [credits.data]
  );
  const writers = useMemo(
    () =>
      credits.data?.crew.filter((member) => ['Writer', 'Screenplay', 'Story'].includes(member.job)) ??
      [],
    [credits.data]
  );
  const trailer = useMemo(
    () =>
      videos.data?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
      videos.data?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer'),
    [videos.data]
  );

  if (details.isLoading) return <LoadingSpinner fullScreen />;
  if (details.isError || !details.data) {
    return <ErrorView onRetry={() => details.refetch()} message="Couldn't load this movie." />;
  }

  const movie = details.data;

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { height: insets.top + 56, zIndex: 10 },
          stickyHeaderStyle,
        ]}>
        <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      </Animated.View>
      <View
        style={{ paddingTop: insets.top + 10, height: insets.top + 56 }}
        className="absolute left-0 right-0 z-20 flex-row items-center justify-between px-4">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
        <Animated.Text
          style={stickyHeaderStyle}
          numberOfLines={1}
          className="mx-3 flex-1 text-center text-base font-bold text-inkLight dark:text-ink">
          {movie.title}
        </Animated.Text>
        <Pressable
          onPress={() =>
            toggleFavorite({
              id: movie.id,
              title: movie.title,
              overview: movie.overview,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              popularity: movie.popularity,
              genre_ids: movie.genres.map((g) => g.id),
              adult: movie.adult,
              original_language: movie.original_language,
            })
          }
          className="h-9 w-9 items-center justify-center rounded-full bg-black/40">
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={19} color={isFavorite ? '#ff8000' : '#fff'} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>
        <View style={{ height: BACKDROP_HEIGHT }}>
          <Image
            source={{ uri: backdropUrl(movie.backdrop_path) ?? undefined }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', isDark ? '#0e1013' : '#ffffff']}
            locations={[0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        <View className="-mt-16 flex-row gap-4 px-4">
          <View className="h-44 w-28 overflow-hidden rounded-md bg-surface-light-soft shadow-lg dark:bg-base-soft">
            <Image
              source={{ uri: posterUrl(movie.poster_path) ?? undefined }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <View className="flex-1 justify-end gap-1.5 pb-1">
            <Text className="text-2xl font-extrabold leading-7 text-inkLight dark:text-ink">
              {movie.title}
            </Text>
            {movie.tagline ? (
              <Text className="text-xs italic text-inkLight-muted dark:text-ink-muted">
                {movie.tagline}
              </Text>
            ) : null}
            <View className="flex-row flex-wrap items-center gap-2 pt-1">
              <RatingBadge voteAverage={movie.vote_average} size="md" />
              <Text className="text-xs text-inkLight-muted dark:text-ink-muted">
                {releaseYear(movie.release_date)}
              </Text>
              <Text className="text-xs text-inkLight-muted dark:text-ink-muted">
                {formatRuntime(movie.runtime)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 px-4 pt-4">
          {movie.genres.map((genre) => (
            <GenreChip key={genre.id} name={genre.name} />
          ))}
        </View>

        {trailer ? (
          <View className="px-4 pt-5">
            <Pressable
              onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
              className="flex-row items-center justify-center gap-2 rounded-md border border-surface-light-border py-3.5 dark:border-base-border">
              <Ionicons name="play" size={16} color={colors.text} />
              <Text className="text-sm font-bold text-inkLight dark:text-ink">Watch trailer</Text>
            </Pressable>
          </View>
        ) : null}

        {movie.overview ? (
          <View className="gap-2 px-4 pt-6">
            <Text className="text-base font-bold text-inkLight dark:text-ink">Overview</Text>
            <Text className="text-sm leading-5 text-inkLight-muted dark:text-ink-muted">
              {movie.overview}
            </Text>
          </View>
        ) : null}

        <View className="gap-1 px-4 pt-6">
          {director ? (
            <Text className="text-sm text-inkLight dark:text-ink">
              <Text className="font-bold">Director  </Text>
              {director.name}
            </Text>
          ) : null}
          {writers.length > 0 ? (
            <Text className="text-sm text-inkLight dark:text-ink">
              <Text className="font-bold">Writers  </Text>
              {writers.map((w) => w.name).join(', ')}
            </Text>
          ) : null}
        </View>

        {credits.data && credits.data.cast.length > 0 ? (
          <View className="gap-3 pt-6">
            <Text className="px-4 text-base font-bold text-inkLight dark:text-ink">Cast</Text>
            <Animated.FlatList
              horizontal
              data={credits.data.cast.slice(0, 15)}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 14, paddingHorizontal: 16 }}
              renderItem={({ item }) => <CastCard member={item} />}
            />
          </View>
        ) : null}

        <View className="gap-1.5 px-4 pt-6">
          <Text className="text-base font-bold text-inkLight dark:text-ink">Details</Text>
          <DetailLine label="Status" value={movie.status} />
          <DetailLine label="Release date" value={formatDate(movie.release_date)} />
          <DetailLine label="Budget" value={formatCurrency(movie.budget)} />
          <DetailLine label="Revenue" value={formatCurrency(movie.revenue)} />
          <DetailLine label="Rating" value={`${formatRating(movie.vote_average)} (${movie.vote_count.toLocaleString()} votes)`} />
        </View>

        {movie.production_companies.length > 0 ? (
          <View className="gap-2 px-4 pt-6">
            <Text className="text-base font-bold text-inkLight dark:text-ink">
              Production companies
            </Text>
            <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
              {movie.production_companies.map((c) => c.name).join(' · ')}
            </Text>
          </View>
        ) : null}

        <View className="pt-6">
          <MovieCarousel
            title="Similar movies"
            movies={similar.data?.results}
            isLoading={similar.isLoading}
          />
        </View>

        <View className="pt-6">
          <MovieCarousel
            title="Recommended"
            movies={recommendations.data?.results}
            isLoading={recommendations.isLoading}
          />
        </View>

        {similar.data?.results.length === 0 && recommendations.data?.results.length === 0 ? (
          <EmptyState icon="film-outline" title="No related movies found" />
        ) : null}
      </Animated.ScrollView>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/add-log',
            params: {
              movieId: String(movie.id),
              title: movie.title,
              poster: movie.poster_path ?? '',
            },
          })
        }
        style={{ bottom: insets.bottom + 20 }}
        className="absolute right-5 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-xl">
        <Ionicons name="create" size={24} color="#000" />
      </Pressable>
    </View>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-surface-light-border py-2 dark:border-base-border">
      <Text className="text-xs text-inkLight-muted dark:text-ink-muted">{label}</Text>
      <Text className="text-xs font-medium text-inkLight dark:text-ink">{value}</Text>
    </View>
  );
}
