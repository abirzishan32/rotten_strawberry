import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { favoriteFilmsApi } from '@/services/supabase';
import { useUserId } from '@/store/auth-store';
import type { TmdbMovieSummary } from '@/types';

export { MAX_FAVORITE_FILMS } from '@/services/supabase/favorite-films';

/** The signed-in user's curated favourite films (max 4), ordered. */
export function useFavoriteFilms(userIdArg?: string) {
  const currentUserId = useUserId();
  const userId = userIdArg ?? currentUserId;
  return useQuery({
    queryKey: queryKeys.favoriteFilms(userId ?? 'anon'),
    queryFn: () => favoriteFilmsApi.listFavoriteFilms(userId as string),
    enabled: !!userId,
  });
}

export function useAddFavoriteFilm() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movie: TmdbMovieSummary) => {
      if (!userId) throw new Error('You must be signed in.');
      return favoriteFilmsApi.addFavoriteFilm(userId, movie);
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.favoriteFilms(userId) });
    },
  });
}

export function useRemoveFavoriteFilm() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieId: number) => {
      if (!userId) throw new Error('You must be signed in.');
      return favoriteFilmsApi.removeFavoriteFilm(userId, movieId);
    },
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.favoriteFilms(userId) });
    },
  });
}

/** Persist a reordered list. Optimistically updates the cache so the drag sticks. */
export function useReorderFavoriteFilms() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ordered: TmdbMovieSummary[]) => {
      if (!userId) throw new Error('You must be signed in.');
      return favoriteFilmsApi.reorderFavoriteFilms(
        userId,
        ordered.map((m) => m.id)
      );
    },
    onMutate: async (ordered) => {
      if (!userId) return {};
      const key = queryKeys.favoriteFilms(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TmdbMovieSummary[]>(key);
      queryClient.setQueryData<TmdbMovieSummary[]>(key, ordered);
      return { previous, key };
    },
    onError: (_err, _vars, context) => {
      if (context?.key && context.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
    },
    onSettled: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.favoriteFilms(userId) });
    },
  });
}
