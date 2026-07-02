import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { fetchMovieList } from '@/services/tmdb';
import type { MovieListCategory } from '@/types';

/** Single page — used for compact home-screen carousels. */
export function useMovieList(category: MovieListCategory) {
  return useQuery({
    queryKey: queryKeys.movieList(category),
    queryFn: () => fetchMovieList(category, 1),
  });
}

/** Paginated — used for full "Browse category" grids with infinite scroll. */
export function useInfiniteMovieList(category: MovieListCategory) {
  return useInfiniteQuery({
    queryKey: queryKeys.movieListInfinite(category),
    queryFn: ({ pageParam }) => fetchMovieList(category, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
