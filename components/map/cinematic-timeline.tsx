import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';

import type { TimelineEntry } from '@/hooks/use-map-data';

/**
 * Vertical timeline of how the user's world-cinema exploration expanded — each
 * year node lists the countries first discovered that year.
 */
export function CinematicTimeline({ timeline }: { timeline: TimelineEntry[] }) {
  if (timeline.length === 0) return null;

  return (
    <View className="px-4">
      {timeline.map((entry, index) => {
        const isLast = index === timeline.length - 1;
        const flags = entry.countries.slice(0, 6);
        const names = entry.countries.map((c) => c.name);
        return (
          <Animated.View
            key={entry.year}
            entering={FadeInLeft.delay(index * 90).duration(500)}
            className="flex-row gap-3">
            {/* rail */}
            <View className="items-center">
              <View className="h-3.5 w-3.5 rounded-full border-2 border-brand bg-brand/30" />
              {!isLast ? <View className="w-0.5 flex-1 bg-white/10" /> : null}
            </View>
            {/* content */}
            <View className={isLast ? 'flex-1 pb-2' : 'flex-1 pb-6'}>
              <Text className="text-base font-extrabold text-white">{entry.year}</Text>
              <Text className="mt-0.5 text-lg">{flags.map((c) => c.flag).join(' ')}</Text>
              <Text className="mt-1 text-xs leading-4 text-white/60">{describe(names)}</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

function describe(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return `Explored cinema from ${names[0]}`;
  if (names.length === 2) return `Discovered ${names[0]} and ${names[1]}`;
  return `Discovered ${names[0]}, ${names[1]} and ${names.length - 2} more`;
}
