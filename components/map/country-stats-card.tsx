import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedCounter } from './animated-counter';

interface CountryStatsCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  /** For string values (e.g. a country name), an optional flag emoji prefix. */
  flag?: string;
  accent?: string;
  delay?: number;
}

/**
 * A frosted-glass stat tile that floats over the map. Blur + translucent border
 * + gradient sheen for the glassmorphism look; numeric values count up.
 */
export function CountryStatsCard({
  icon,
  label,
  value,
  flag,
  accent = '#00e054',
  delay = 0,
}: CountryStatsCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(650).springify().damping(16)}
      style={styles.card}>
      <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View className="gap-1.5 p-3.5">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name={icon} size={13} color={accent} />
          <Text className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
            {label}
          </Text>
        </View>
        {typeof value === 'number' ? (
          <AnimatedCounter value={value} className="text-2xl font-extrabold text-white" />
        ) : (
          <Text numberOfLines={1} className="text-lg font-extrabold text-white">
            {flag ? `${flag} ` : ''}
            {value}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 158,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});
