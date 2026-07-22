// URL polyfill must be imported before anything touches supabase-js in RN.
import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AppState } from 'react-native';

import type { Database } from './types';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;

if ((!supabaseUrl || !supabaseAnonKey) && __DEV__) {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_ANON_KEY are not set. Add them to your .env ' +
      'file and restart the dev server (see supabase/README.md).'
  );
}

/**
 * The single Supabase client for the app. Uses AsyncStorage so the auth session
 * survives app restarts, and never parses the URL for a session (that's a
 * web-only OAuth concern — `detectSessionInUrl: false` for React Native).
 */
export const supabase = createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Supabase recommends tying token auto-refresh to app foreground state so we
// don't burn refreshes while backgrounded. Registered once at module load.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
