export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
}

export interface TmdbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TmdbProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TmdbSpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface TmdbMovieDetails extends Omit<TmdbMovieSummary, 'genre_ids'> {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  spoken_languages: TmdbSpokenLanguage[];
}

export interface TmdbCastMember {
  id: number;
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideo[];
}

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type TmdbMovieListResponse = TmdbPaginatedResponse<TmdbMovieSummary>;

export interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

export type MovieListCategory =
  | 'trending'
  | 'popular'
  | 'top_rated'
  | 'upcoming'
  | 'now_playing';

export type SortOption =
  | 'popularity.desc'
  | 'popularity.asc'
  | 'vote_average.desc'
  | 'vote_average.asc'
  | 'release_date.desc'
  | 'release_date.asc'
  | 'title.asc'
  | 'title.desc';

export interface DiscoverFilters {
  genreId?: number;
  year?: number;
  minRating?: number;
  language?: string;
  minRuntime?: number;
  maxRuntime?: number;
  sortBy?: SortOption;
}
