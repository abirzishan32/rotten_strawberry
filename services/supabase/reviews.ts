import type { MovieLogEntry } from '@/types';

import { supabase } from './client';
import { ensureProfile } from './profiles';
import {
  newReviewToInsert,
  reviewRowToLogEntry,
  reviewRowToReviewWithAuthor,
  type NewReviewInput,
  type ReviewUpdatePatch,
  type ReviewWithAuthor,
} from './types';

const AUTHOR_SELECT = '*, author:profiles(id, username, display_name, avatar_url)';

/** All of a single user's diary/log entries, newest first. */
export async function listMyReviews(userId: string): Promise<MovieLogEntry[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(reviewRowToLogEntry);
}

/** Reviews for one movie that the viewer is allowed to see (public + own), with author. */
export async function listMovieReviews(movieId: number): Promise<ReviewWithAuthor[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(AUTHOR_SELECT)
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => reviewRowToReviewWithAuthor(row as never));
}

/** Global community feed of recent public reviews, with author. */
export async function listRecentPublicReviews(limit = 30): Promise<ReviewWithAuthor[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(AUTHOR_SELECT)
    .eq('privacy', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => reviewRowToReviewWithAuthor(row as never));
}

export async function createReview(input: NewReviewInput, userId: string): Promise<MovieLogEntry> {
  // reviews.user_id -> profiles(id): make sure the profile row exists first so
  // the insert can't fail the foreign key for accounts that predate the trigger.
  await ensureProfile(userId);
  const { data, error } = await supabase
    .from('reviews')
    .insert(newReviewToInsert(input, userId))
    .select('*')
    .single();
  if (error) throw error;
  return reviewRowToLogEntry(data);
}

export async function updateReview(id: string, patch: ReviewUpdatePatch): Promise<MovieLogEntry> {
  const { data, error } = await supabase
    .from('reviews')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return reviewRowToLogEntry(data);
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}
