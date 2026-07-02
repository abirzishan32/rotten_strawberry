import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChips, FeaturedBanner, MovieCarousel } from '@/components/movie';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useMovieList } from '@/hooks/queries';
import { queryClient } from '@/services/query-client';
import { queryKeys } from '@/constants/query-keys';
import { getGreeting } from '@/utils/format';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);

  const trending = useMovieList('trending');
  const popular = useMovieList('popular');
  const topRated = useMovieList('top_rated');
  const upcoming = useMovieList('upcoming');
  const nowPlaying = useMovieList('now_playing');

  const featured = trending.data?.results?.[0];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(
      (['trending', 'popular', 'top_rated', 'upcoming', 'now_playing'] as const).map((category) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.movieList(category) })
      )
    );
    setRefreshing(false);
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View
          style={{ paddingTop: insets.top + 12 }}
          className="flex-row items-center justify-between px-4 pb-3">
          <View>
            <Text className="text-xs font-medium text-inkLight-muted dark:text-ink-muted">
              {getGreeting()}
            </Text>
            <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">CineLog</Text>
          </View>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </View>

        {featured ? <FeaturedBanner movie={featured} /> : null}

        <View className="gap-7 pt-6">
          <View className="gap-3">
            <Text className="px-4 text-lg font-bold text-inkLight dark:text-ink">
              Browse by genre
            </Text>
            <CategoryChips />
          </View>

          <MovieCarousel
            title="Trending this week"
            movies={trending.data?.results}
            isLoading={trending.isLoading}
            category="trending"
          />
          <MovieCarousel
            title="Popular"
            movies={popular.data?.results}
            isLoading={popular.isLoading}
            category="popular"
          />
          <MovieCarousel
            title="Top rated"
            movies={topRated.data?.results}
            isLoading={topRated.isLoading}
            category="top_rated"
          />
          <MovieCarousel
            title="Recently released"
            movies={nowPlaying.data?.results}
            isLoading={nowPlaying.isLoading}
            category="now_playing"
          />
          <MovieCarousel
            title="Coming soon"
            movies={upcoming.data?.results}
            isLoading={upcoming.isLoading}
            category="upcoming"
          />
        </View>
      </ScrollView>
    </View>
  );
}
