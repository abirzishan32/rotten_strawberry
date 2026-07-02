import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

export function AddLogTabButton({ onPress }: BottomTabBarButtonProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log a movie"
        onPress={(e) => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          onPress?.(e);
        }}
        className="h-12 w-12 -translate-y-2 items-center justify-center rounded-full bg-brand shadow-lg active:opacity-80">
        <Ionicons name="add" size={26} color="#000" />
      </Pressable>
    </View>
  );
}
