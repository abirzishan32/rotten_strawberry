import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
}

/**
 * Holds the current Supabase auth session. It is kept in sync by
 * `useAuthInit()` (which subscribes to `supabase.auth.onAuthStateChange`), so
 * nothing else should call `setSession` directly.
 */
export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  session: null,
  user: null,
  setSession: (session) =>
    set((state) => {
      const status: AuthStatus = session ? 'authenticated' : 'unauthenticated';
      // Ignore redundant updates. Supabase re-emits auth events (e.g. token
      // refresh) with an equivalent session; without this guard every emit
      // would replace the store state and re-render all subscribers.
      if (
        state.status === status &&
        state.session?.access_token === session?.access_token &&
        state.user?.id === session?.user?.id
      ) {
        return state;
      }
      return { session, user: session?.user ?? null, status };
    }),
}));

// Convenience selectors.
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useUserId = () => useAuthStore((s) => s.user?.id ?? null);
export const useIsAuthenticated = () => useAuthStore((s) => s.status === 'authenticated');
