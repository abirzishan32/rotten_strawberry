import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => {
        nativewindColorScheme.set(preference);
        set({ preference });
      },
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          nativewindColorScheme.set(state.preference);
        }
      },
    }
  )
);
