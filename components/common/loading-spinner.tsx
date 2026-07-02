import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ fullScreen = false, size = 'large' }: LoadingSpinnerProps) {
  const { colors } = useAppTheme();

  if (!fullScreen) {
    return <ActivityIndicator size={size} color={colors.tint} />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-base">
      <ActivityIndicator size={size} color={colors.tint} />
    </View>
  );
}
