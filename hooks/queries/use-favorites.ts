import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { favoritesApi } from '@/services/supabase';
import { useUserId } from '@/store/auth-store';
import type { TmdbMovieSummary } from '@/types';

export function useFavorites() {
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.favorites(userId ?? 'anon'),
    queryFn: () => favoritesApi.listFavorites(userId as string),
    enabled: !!userId,
  });
}

export function useIsFavorite(movieId: number) {
  const { data } = useFavorites();
  return !!data?.some((movie) => movie.id === movieId);
}

/** Optimistic add/remove. Pass the current `isFavorite` so we know which way to toggle. */
export function useToggleFavorite() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movie, isFavorite }: { movie: TmdbMovieSummary; isFavorite: boolean }) => {
      if (!userId) throw new Error('You must be signed in to favorite movies.');
      if (isFavorite) await favoritesApi.removeFavorite(userId, movie.id);
      else await favoritesApi.addFavorite(userId, movie);
    },
    onMutate: async ({ movie, isFavorite }) => {
      if (!userId) return {};
      const key = queryKeys.favorites(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TmdbMovieSummary[]>(key);
      queryClient.setQueryData<TmdbMovieSummary[]>(key, (old = []) =>
        isFavorite
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
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.favorites(userId) });
    },
  });
}
