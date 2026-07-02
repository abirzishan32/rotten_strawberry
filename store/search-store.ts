import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MAX_RECENT_SEARCHES = 10;

interface SearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const deduped = [trimmed, ...state.recentSearches.filter((item) => item !== trimmed)];
          return { recentSearches: deduped.slice(0, MAX_RECENT_SEARCHES) };
        }),
      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((item) => item !== query),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'recent-searches',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
