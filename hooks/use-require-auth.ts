import { router } from 'expo-router';
import { useCallback } from 'react';

import { useAuthStore } from '@/store/auth-store';

/**
 * Returns a guard for actions that need a signed-in user. Call the returned
 * function at the top of a handler: if the user isn't authenticated it opens
 * the auth modal and returns `false`, so the caller can bail early.
 *
 *   const requireAuth = useRequireAuth();
 *   const onFavorite = () => { if (!requireAuth()) return; ...mutate... };
 */
export function useRequireAuth() {
  const status = useAuthStore((s) => s.status);
  return useCallback(() => {
    if (status !== 'authenticated') {
      router.push('/auth');
      return false;
    }
    return true;
  }, [status]);
}
