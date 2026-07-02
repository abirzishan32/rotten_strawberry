import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MovieLogEntry } from '@/types';

interface LogState {
  entries: MovieLogEntry[];
  addEntry: (entry: MovieLogEntry) => void;
  updateEntry: (id: string, entry: Partial<MovieLogEntry>) => void;
  removeEntry: (id: string) => void;
  getEntriesForMovie: (movieId: number) => MovieLogEntry[];
}

export const useLogStore = create<LogState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
      updateEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
        })),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
      getEntriesForMovie: (movieId) => get().entries.filter((entry) => entry.movieId === movieId),
    }),
    {
      name: 'movie-log-entries',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
