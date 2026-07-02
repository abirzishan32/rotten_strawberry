import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { TmdbMovieSummary } from '@/types';

interface FavoritesState {
  favorites: TmdbMovieSummary[];
  toggleFavorite: (movie: TmdbMovieSummary) => void;
  isFavorite: (movieId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (movie) =>
        set((state) => {
          const exists = state.favorites.some((item) => item.id === movie.id);
          return {
            favorites: exists
              ? state.favorites.filter((item) => item.id !== movie.id)
              : [movie, ...state.favorites],
          };
        }),
      isFavorite: (movieId) => get().favorites.some((item) => item.id === movieId),
    }),
    {
      name: 'favorite-movies',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
