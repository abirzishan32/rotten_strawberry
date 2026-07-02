import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

export function TabBarBackground() {
  const { isDark } = useAppTheme();

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFillObject}
      />
    );
  }

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      className="bg-white/95 dark:bg-base/95"
    />
  );
}
