import { useEffect } from 'react';

import { queryClient } from '@/services/query-client';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hydrates the auth store from the persisted session and keeps it in sync with
 * Supabase. Call once, at the app root.
 *
 * Notes on the shape:
 * - Empty dep array + `getState()` (instead of subscribing to `setSession`) so
 *   the effect is set up exactly once and never re-subscribes.
 * - `invalidateQueries` is deferred with `setTimeout`. Supabase advises against
 *   doing synchronous work inside `onAuthStateChange`; running it inline can
 *   re-enter the auth client and cascade updates.
 */
export function useAuthInit() {
  useEffect(() => {
    const setSession = useAuthStore.getState().setSession;
    let mounted = true;

    // Initial hydrate from the AsyncStorage-persisted session.
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(session);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // Drop cached per-user data so queries refetch for the right account.
        setTimeout(() => queryClient.invalidateQueries(), 0);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
}
