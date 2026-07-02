import { tmdbClient } from './client';
import type {
  DiscoverFilters,
  MovieListCategory,
  TmdbCredits,
  TmdbGenreListResponse,
  TmdbMovieDetails,
  TmdbMovieListResponse,
  TmdbVideosResponse,
} from '@/types';

const CATEGORY_PATHS: Record<MovieListCategory, string> = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  top_rated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  now_playing: '/movie/now_playing',
};

export async function fetchMovieList(
  category: MovieListCategory,
  page = 1
): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>(CATEGORY_PATHS[category], {
    params: { page },
  });
  return data;
}

export async function fetchMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
  const { data } = await tmdbClient.get<TmdbMovieDetails>(`/movie/${movieId}`);
  return data;
}

export async function fetchMovieCredits(movieId: number): Promise<TmdbCredits> {
  const { data } = await tmdbClient.get<TmdbCredits>(`/movie/${movieId}/credits`);
  return data;
}

export async function fetchMovieVideos(movieId: number): Promise<TmdbVideosResponse> {
  const { data } = await tmdbClient.get<TmdbVideosResponse>(`/movie/${movieId}/videos`);
  return data;
}

export async function fetchSimilarMovies(
  movieId: number,
  page = 1
): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>(`/movie/${movieId}/similar`, {
    params: { page },
  });
  return data;
}

export async function fetchMovieRecommendations(
  movieId: number,
  page = 1
): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>(
    `/movie/${movieId}/recommendations`,
    { params: { page } }
  );
  return data;
}

export async function fetchGenres(): Promise<TmdbGenreListResponse> {
  const { data } = await tmdbClient.get<TmdbGenreListResponse>('/genre/movie/list');
  return data;
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

export async function fetchTrendingSearchTerms(): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>('/trending/movie/day');
  return data;
}

export async function discoverMovies(
  filters: DiscoverFilters,
  page = 1
): Promise<TmdbMovieListResponse> {
  const { data } = await tmdbClient.get<TmdbMovieListResponse>('/discover/movie', {
    params: {
      page,
      with_genres: filters.genreId,
      primary_release_year: filters.year,
      'vote_average.gte': filters.minRating,
      with_original_language: filters.language,
      'with_runtime.gte': filters.minRuntime,
      'with_runtime.lte': filters.maxRuntime,
      sort_by: filters.sortBy ?? 'popularity.desc',
    },
  });
  return data;
}
