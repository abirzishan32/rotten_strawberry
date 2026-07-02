import React, { useEffect } from 'react';
import { View, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, radius = 8, className }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius }, animatedStyle]}
      className={['bg-surface-light-border dark:bg-base-elevated', className ?? ''].join(' ')}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <View style={{ width: 128 }} className="gap-2">
      <Skeleton width={128} height={188} radius={12} />
      <Skeleton width={100} height={12} />
      <Skeleton width={60} height={10} />
    </View>
  );
}

export function CarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View className="flex-row gap-3 px-4">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </View>
  );
}
