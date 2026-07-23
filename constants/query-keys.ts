import type { DiscoverFilters, MovieListCategory } from '@/types';

export const queryKeys = {
  movieList: (category: MovieListCategory) => ['movies', 'list', category] as const,
  movieListInfinite: (category: MovieListCategory) =>
    ['movies', 'list-infinite', category] as const,
  movieDetails: (movieId: number) => ['movies', 'details', movieId] as const,
  movieCredits: (movieId: number) => ['movies', 'credits', movieId] as const,
  movieVideos: (movieId: number) => ['movies', 'videos', movieId] as const,
  similarMovies: (movieId: number) => ['movies', 'similar', movieId] as const,
  recommendations: (movieId: number) => ['movies', 'recommendations', movieId] as const,
  genres: () => ['genres'] as const,
  search: (query: string) => ['movies', 'search', query] as const,
  trendingSearches: () => ['movies', 'trending-searches'] as const,
  discover: (filters: DiscoverFilters) => ['movies', 'discover', filters] as const,

  // Supabase-backed, per-user data.
  profile: (userId: string) => ['profile', userId] as const,
  myReviews: (userId: string) => ['reviews', 'mine', userId] as const,
  movieReviews: (movieId: number) => ['reviews', 'movie', movieId] as const,
  recentReviews: () => ['reviews', 'recent'] as const,
  favorites: (userId: string) => ['favorites', userId] as const,
  watchlist: (userId: string) => ['watchlist', userId] as const,
  favoriteFilms: (userId: string) => ['favorite-films', userId] as const,
};
