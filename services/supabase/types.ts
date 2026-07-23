import type { MovieLogEntry, PrivacyLevel, TmdbMovieSummary } from '@/types';

// ============================================================================
// Database row shapes (snake_case, mirror supabase/schema.sql) + a minimal
// `Database` type so the Supabase client is type-checked. This is hand-written
// rather than generated — keep it in sync with schema.sql.
// ============================================================================

// NOTE: these are `type` aliases, not `interface`s, on purpose. TypeScript does
// not treat an `interface` as assignable to `Record<string, unknown>`, which is
// what postgrest-js's `GenericTable`/`GenericSchema` constraints require — an
// interface here silently collapses the whole schema to `never`.
export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  poster_path: string | null;
  genre_ids: number[];
  rating: number;
  rating_ending: number;
  rating_rewatchability: number;
  rating_pacing: number;
  review_text: string;
  watched: boolean;
  watched_date: string | null;
  liked: boolean;
  contains_spoilers: boolean;
  tags: string[];
  privacy: PrivacyLevel;
  created_at: string;
};

export type MovieCacheRow = {
  id: string;
  user_id: string;
  movie_id: number;
  movie: TmdbMovieSummary;
  created_at: string;
};

export type FavoriteFilmRow = {
  id: string;
  user_id: string;
  movie_id: number;
  movie: TmdbMovieSummary;
  position: number;
  created_at: string;
};

type ProfileInsert = { id: string; username?: string | null; display_name?: string | null };
type ProfileUpdate = Partial<Pick<ProfileRow, 'username' | 'display_name' | 'bio' | 'location' | 'avatar_url'>>;

type ReviewInsert = Omit<ReviewRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
export type ReviewUpdatePatch = Partial<Omit<ReviewRow, 'id' | 'user_id' | 'created_at'>>;
type ReviewUpdate = ReviewUpdatePatch;

type MovieCacheInsert = Omit<MovieCacheRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
type FavoriteFilmInsert = Omit<FavoriteFilmRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
type FavoriteFilmUpdate = Partial<FavoriteFilmInsert>;

// Each table carries an empty `Relationships` tuple: postgrest-js's GenericTable
// constraint requires the key, and without it the whole schema degrades to
// `never` (making every insert/update reject its argument).
export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: ProfileInsert; Update: ProfileUpdate; Relationships: [] };
      reviews: { Row: ReviewRow; Insert: ReviewInsert; Update: ReviewUpdate; Relationships: [] };
      favorites: { Row: MovieCacheRow; Insert: MovieCacheInsert; Update: Partial<MovieCacheInsert>; Relationships: [] };
      watchlist: { Row: MovieCacheRow; Insert: MovieCacheInsert; Update: Partial<MovieCacheInsert>; Relationships: [] };
      favorite_films: { Row: FavoriteFilmRow; Insert: FavoriteFilmInsert; Update: FavoriteFilmUpdate; Relationships: [] };
    };
    // `{ [_ in never]: never }` (not `Record<string, never>`): the latter adds a
    // `[key: string]: never` index signature that, when intersected as
    // `Tables & Views`, turns every table into `never`.
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}

// ============================================================================
// App-facing shapes + mappers between DB rows and the types the UI already uses.
// ============================================================================

export interface ReviewAuthor {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

/** A review plus its author profile — used by the movie-detail and activity feeds. */
export interface ReviewWithAuthor extends MovieLogEntry {
  userId: string;
  author: ReviewAuthor | null;
}

/** The app-shaped payload the add-log form produces for a new review. */
export interface NewReviewInput {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  genreIds: number[];
  rating: number;
  ratingEnding: number;
  ratingRewatchability: number;
  ratingPacing: number;
  reviewText: string;
  watched: boolean;
  watchedDate: string;
  liked: boolean;
  containsSpoilers: boolean;
  tags: string[];
  privacy: PrivacyLevel;
}

export function reviewRowToLogEntry(row: ReviewRow): MovieLogEntry {
  return {
    id: row.id,
    movieId: row.movie_id,
    movieTitle: row.movie_title,
    posterPath: row.poster_path,
    genreIds: row.genre_ids ?? [],
    rating: Number(row.rating),
    ratingEnding: Number(row.rating_ending ?? 0),
    ratingRewatchability: Number(row.rating_rewatchability ?? 0),
    ratingPacing: Number(row.rating_pacing ?? 0),
    reviewText: row.review_text ?? '',
    watched: row.watched,
    watchedDate: row.watched_date ?? row.created_at,
    liked: row.liked,
    containsSpoilers: row.contains_spoilers,
    tags: row.tags ?? [],
    privacy: row.privacy,
    createdAt: row.created_at,
  };
}

type ReviewRowWithProfile = ReviewRow & {
  author?: Pick<ProfileRow, 'id' | 'username' | 'display_name' | 'avatar_url'> | null;
};

export function reviewRowToReviewWithAuthor(row: ReviewRowWithProfile): ReviewWithAuthor {
  return {
    ...reviewRowToLogEntry(row),
    userId: row.user_id,
    author: row.author
      ? {
          id: row.author.id,
          username: row.author.username,
          displayName: row.author.display_name,
          avatarUrl: row.author.avatar_url,
        }
      : null,
  };
}

/** Map the add-log payload + owner id to a `reviews` insert row. */
export function newReviewToInsert(input: NewReviewInput, userId: string): Database['public']['Tables']['reviews']['Insert'] {
  return {
    user_id: userId,
    movie_id: input.movieId,
    movie_title: input.movieTitle,
    poster_path: input.posterPath,
    genre_ids: input.genreIds,
    rating: input.rating,
    rating_ending: input.ratingEnding,
    rating_rewatchability: input.ratingRewatchability,
    rating_pacing: input.ratingPacing,
    review_text: input.reviewText,
    watched: input.watched,
    watched_date: input.watchedDate,
    liked: input.liked,
    contains_spoilers: input.containsSpoilers,
    tags: input.tags,
    privacy: input.privacy,
  };
}
