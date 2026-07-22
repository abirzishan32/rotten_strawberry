import type { Session } from '@supabase/supabase-js';

import { supabase } from './client';

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Create an account. With "Confirm email" disabled in the Supabase dashboard,
 * this returns an active session immediately; otherwise `data.session` is null
 * until the user confirms via email.
 */
export async function signUp({ email, password, displayName }: SignUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: displayName?.trim() ? { display_name: displayName.trim() } : undefined,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
