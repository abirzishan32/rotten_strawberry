import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';

import { MovieGridScreen } from '@/components/movie';
import { useInfiniteMovieList } from '@/hooks/queries';
import type { MovieListCategory } from '@/types';

const CATEGORY_TITLES: Record<MovieListCategory, string> = {
  trending: 'Trending this week',
  popular: 'Popular movies',
  top_rated: 'Top rated',
  upcoming: 'Coming soon',
  now_playing: 'Recently released',
};

export default function BrowseCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: MovieListCategory }>();
  const query = useInfiniteMovieList(category);

  const movies = useMemo(() => query.data?.pages.flatMap((page) => page.results) ?? [], [query.data]);

  return (
    <MovieGridScreen
      title={CATEGORY_TITLES[category] ?? 'Browse'}
      movies={movies}
      isLoading={query.isLoading}
      isError={query.isError}
      onRetry={() => query.refetch()}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
      }}
    />
  );
}
