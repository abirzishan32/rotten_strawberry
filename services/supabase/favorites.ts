import type { TmdbMovieSummary } from '@/types';

import { supabase } from './client';
import type { MovieCacheRow } from './types';

/** Movies the user has hearted, newest first. */
export async function listFavorites(userId: string): Promise<TmdbMovieSummary[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('movie')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => (row as Pick<MovieCacheRow, 'movie'>).movie);
}

export async function addFavorite(userId: string, movie: TmdbMovieSummary): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .upsert({ user_id: userId, movie_id: movie.id, movie }, { onConflict: 'user_id,movie_id' });
  if (error) throw error;
}

export async function removeFavorite(userId: string, movieId: number): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  if (error) throw error;
}
