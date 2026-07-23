import { decode } from 'base64-arraybuffer';

import { supabase } from './client';

export const AVATAR_BUCKET = 'avatars';

/**
 * Upload a profile picture to the `avatars` storage bucket and return its public
 * URL (cache-busted so the new image shows immediately after replacing an old one).
 *
 * `base64` comes from expo-image-picker (which always hands back JPEG data), so we
 * decode it to an ArrayBuffer — the reliable way to send binary to Supabase Storage
 * from React Native. The file lives at `<userId>/avatar.jpg`; RLS (see
 * supabase/storage.sql) restricts writes to a user's own folder.
 */
export async function uploadAvatar(userId: string, base64: string): Promise<string> {
  const path = `${userId}/avatar.jpg`;

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, decode(base64), { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?v=${Date.now()}`;
}
