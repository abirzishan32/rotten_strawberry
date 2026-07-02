import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieRecommendations,
  fetchMovieVideos,
  fetchSimilarMovies,
} from '@/services/tmdb';

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: queryKeys.movieDetails(movieId),
    queryFn: () => fetchMovieDetails(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: queryKeys.movieCredits(movieId),
    queryFn: () => fetchMovieCredits(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: queryKeys.movieVideos(movieId),
    queryFn: () => fetchMovieVideos(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: queryKeys.similarMovies(movieId),
    queryFn: () => fetchSimilarMovies(movieId),
    enabled: Number.isFinite(movieId),
  });
}

export function useMovieRecommendations(movieId: number) {
  return useQuery({
    queryKey: queryKeys.recommendations(movieId),
    queryFn: () => fetchMovieRecommendations(movieId),
    enabled: Number.isFinite(movieId),
  });
}
