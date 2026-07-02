import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';

import { MovieGridScreen } from '@/components/movie';
import { useDiscoverMovies } from '@/hooks/queries';

export default function BrowseGenreScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const genreId = Number(id);
  const query = useDiscoverMovies({ genreId });

  const movies = useMemo(() => query.data?.pages.flatMap((page) => page.results) ?? [], [query.data]);

  return (
    <MovieGridScreen
      title={name ?? 'Genre'}
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
