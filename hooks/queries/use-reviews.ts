import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { reviewsApi, type NewReviewInput } from '@/services/supabase';
import { useUserId } from '@/store/auth-store';

/** The signed-in user's own diary/log entries. */
export function useMyReviews() {
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.myReviews(userId ?? 'anon'),
    queryFn: () => reviewsApi.listMyReviews(userId as string),
    enabled: !!userId,
  });
}

/** Reviews visible to the viewer for a single movie (public ones + their own). */
export function useMovieReviews(movieId: number) {
  return useQuery({
    queryKey: queryKeys.movieReviews(movieId),
    queryFn: () => reviewsApi.listMovieReviews(movieId),
    enabled: Number.isFinite(movieId) && movieId > 0,
  });
}

/** Global community feed of recent public reviews. */
export function useRecentReviews() {
  return useQuery({
    queryKey: queryKeys.recentReviews(),
    queryFn: () => reviewsApi.listRecentPublicReviews(30),
  });
}

export function useCreateReview() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewReviewInput) => {
      if (!userId) throw new Error('You must be signed in to log a movie.');
      return reviewsApi.createReview(input, userId);
    },
    onSuccess: (entry) => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.myReviews(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.movieReviews(entry.movieId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentReviews() });
    },
  });
}

export function useDeleteReview() {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.myReviews(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentReviews() });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'movie'] });
    },
  });
}
