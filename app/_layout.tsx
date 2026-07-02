import '../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/common';
import { BrandColors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { queryClient } from '@/services/query-client';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationLightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: BrandColors.greenDim },
};

const navigationDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, primary: BrandColors.green, background: '#0e1013' },
};

export default function RootLayout() {
  const { isDark } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <ThemeProvider value={isDark ? navigationDarkTheme : navigationLightTheme}>
              <ErrorBoundary>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="browse/[category]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="browse/genre/[id]" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="add-log"
                    options={{ presentation: 'modal', headerShown: false }}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{ presentation: 'modal', headerShown: false }}
                  />
                </Stack>
              </ErrorBoundary>
              <StatusBar style={isDark ? 'light' : 'dark'} />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
