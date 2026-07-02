import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { fetchGenres } from '@/services/tmdb';

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: fetchGenres,
    staleTime: Infinity,
    select: (data) => data.genres,
  });
}
