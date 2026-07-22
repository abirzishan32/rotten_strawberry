import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { watchlistApi } from '@/services/supabase';
import { useUserId } from '@/store/auth-store';
import type { TmdbMovieSummary } from '@/types';

export function useWatchlist() {
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.watchlist(userId ?? 'anon'),
    queryFn: () => watchlistApi.listWatchlist(userId as string),
    enabled: !!userId,
  });
}

export function useIsInWatchlist(movieId: number) {
  const { data } = useWatchlist();
  return !!data?.some((movie) => movie.id === movieId);
}

/** Optimistic add/remove. Pass the current `inWatchlist` so we know which way to toggle. */
export function useToggleWatchlist() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movie, inWatchlist }: { movie: TmdbMovieSummary; inWatchlist: boolean }) => {
      if (!userId) throw new Error('You must be signed in to use your watchlist.');
      if (inWatchlist) await watchlistApi.removeFromWatchlist(userId, movie.id);
      else await watchlistApi.addToWatchlist(userId, movie);
    },
    onMutate: async ({ movie, inWatchlist }) => {
      if (!userId) return {};
      const key = queryKeys.watchlist(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TmdbMovieSummary[]>(key);
      queryClient.setQueryData<TmdbMovieSummary[]>(key, (old = []) =>
        inWatchlist
          ? old.filter((m) => m.id !== movie.id)
          : [movie, ...old.filter((m) => m.id !== movie.id)]
      );
      return { previous, key };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.watchlist(userId) });
    },
  });
}
