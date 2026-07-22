import type { TmdbMovieSummary } from '@/types';

import { supabase } from './client';
import type { MovieCacheRow } from './types';

/** Movies the user wants to watch, newest first. */
export async function listWatchlist(userId: string): Promise<TmdbMovieSummary[]> {
  const { data, error } = await supabase
    .from('watchlist')
    .select('movie')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => (row as Pick<MovieCacheRow, 'movie'>).movie);
}

export async function addToWatchlist(userId: string, movie: TmdbMovieSummary): Promise<void> {
  const { error } = await supabase
    .from('watchlist')
    .upsert({ user_id: userId, movie_id: movie.id, movie }, { onConflict: 'user_id,movie_id' });
  if (error) throw error;
}

export async function removeFromWatchlist(userId: string, movieId: number): Promise<void> {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  if (error) throw error;
}
