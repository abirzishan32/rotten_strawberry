import type { TmdbMovieSummary } from '@/types';

import { supabase } from './client';
import type { FavoriteFilmRow } from './types';

export const MAX_FAVORITE_FILMS = 4;

/** The curated favourite-film showcase for a user, ordered by `position`. */
export async function listFavoriteFilms(userId: string): Promise<TmdbMovieSummary[]> {
  const { data, error } = await supabase
    .from('favorite_films')
    .select('movie, position')
    .eq('user_id', userId)
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => (row as Pick<FavoriteFilmRow, 'movie'>).movie);
}

/** Append a film to the end of the showcase (no-op past MAX_FAVORITE_FILMS). */
export async function addFavoriteFilm(userId: string, movie: TmdbMovieSummary): Promise<void> {
  const { count, error: countError } = await supabase
    .from('favorite_films')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (countError) throw countError;
  if ((count ?? 0) >= MAX_FAVORITE_FILMS) {
    throw new Error(`You can only pick ${MAX_FAVORITE_FILMS} favourite films.`);
  }
  const { error } = await supabase.from('favorite_films').upsert(
    { user_id: userId, movie_id: movie.id, movie, position: count ?? 0 },
    { onConflict: 'user_id,movie_id', ignoreDuplicates: true }
  );
  if (error) throw error;
}

export async function removeFavoriteFilm(userId: string, movieId: number): Promise<void> {
  const { error } = await supabase
    .from('favorite_films')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  if (error) throw error;
}

/**
 * Persist a new order. `orderedMovieIds` is the full list of the user's favourite
 * films in the desired order; each row's `position` is set to its index.
 */
export async function reorderFavoriteFilms(userId: string, orderedMovieIds: number[]): Promise<void> {
  await Promise.all(
    orderedMovieIds.map((movieId, index) =>
      supabase
        .from('favorite_films')
        .update({ position: index })
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .then(({ error }) => {
          if (error) throw error;
        })
    )
  );
}
