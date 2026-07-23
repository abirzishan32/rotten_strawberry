import { supabase } from './client';
import type { ProfileRow } from './types';

/**
 * Guarantee a `profiles` row exists for the signed-in user. The signup trigger
 * normally creates it, but accounts made before the trigger was installed (or if
 * the trigger is missing) won't have one — and `reviews.user_id` has a FK to
 * `profiles(id)`, so logging a movie would fail. `ignoreDuplicates` makes this a
 * no-op when the profile already exists, so it never clobbers real profile data.
 */
export async function ensureProfile(userId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type ProfilePatch = Partial<
  Pick<ProfileRow, 'username' | 'display_name' | 'bio' | 'location' | 'avatar_url'>
>;

export async function updateProfile(userId: string, patch: ProfilePatch): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}
