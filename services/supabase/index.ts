export { supabase } from './client';
export { getSupabaseErrorMessage } from './errors';
export * from './types';
export * as authApi from './auth';
export * as profilesApi from './profiles';
export * as reviewsApi from './reviews';
export * as favoritesApi from './favorites';
export * as watchlistApi from './watchlist';
export * as favoriteFilmsApi from './favorite-films';
export * as storageApi from './storage';

// Type-only re-exports so callers can name these without the namespace prefix.
export type { ProfilePatch } from './profiles';
export type { SignUpParams } from './auth';
