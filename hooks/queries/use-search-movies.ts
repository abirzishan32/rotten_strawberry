import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { discoverMovies, fetchTrendingSearchTerms, searchMovies } from '@/services/tmdb';
import type { DiscoverFilters } from '@/types';

export function useSearchMovies(query: string) {
  const trimmed = query.trim();
  return useInfiniteQuery({
    queryKey: queryKeys.search(trimmed),
    queryFn: ({ pageParam }) => searchMovies(trimmed, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: trimmed.length > 0,
  });
}

export function useTrendingSearches() {
  return useQuery({
    queryKey: queryKeys.trendingSearches(),
    queryFn: fetchTrendingSearchTerms,
    select: (data) => data.results.slice(0, 8),
  });
}

export function useDiscoverMovies(filters: DiscoverFilters, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.discover(filters),
    queryFn: ({ pageParam }) => discoverMovies(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
  });
}
