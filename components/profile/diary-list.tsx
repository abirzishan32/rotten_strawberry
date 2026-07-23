import { Image } from 'expo-image';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StarRating } from '@/components/review';
import type { MovieLogEntry } from '@/types';
import { posterUrl } from '@/utils/image';

/**
 * A diary/calendar view of watched films grouped by month & year, newest first —
 * each row shows the day-of-month, poster, title and rating so you can see which
 * day of which year a film was watched. Inspired by Letterboxd's diary, built
 * from scratch for this app.
 */
export function DiaryList({
  entries,
  onPressEntry,
}: {
  entries: MovieLogEntry[];
  onPressEntry: (movieId: number) => void;
}) {
  const groups = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime()
    );
    const map = new Map<string, MovieLogEntry[]>();
    for (const entry of sorted) {
      const key = format(new Date(entry.watchedDate), 'MMMM yyyy');
      const bucket = map.get(key);
      if (bucket) bucket.push(entry);
      else map.set(key, [entry]);
    }
    return [...map.entries()];
  }, [entries]);

  return (
    <View>
      {groups.map(([month, monthEntries]) => (
        <View key={month}>
          <View className="bg-surface-light-soft px-4 py-1.5 dark:bg-base-soft">
            <Text className="text-xs font-bold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
              {month}
            </Text>
          </View>
          {monthEntries.map((entry) => {
            const uri = posterUrl(entry.posterPath, 'w185');
            return (
              <Pressable
                key={entry.id}
                onPress={() => onPressEntry(entry.movieId)}
                className="flex-row items-center gap-3 border-b border-surface-light-border px-4 py-2.5 dark:border-base-border">
                <View className="h-11 w-11 items-center justify-center rounded-sm border border-surface-light-border dark:border-base-border">
                  <Text className="text-base font-bold text-inkLight dark:text-ink">
                    {format(new Date(entry.watchedDate), 'd')}
                  </Text>
                </View>
                <View className="h-16 w-11 overflow-hidden rounded-xs bg-surface-light-soft dark:bg-base-soft">
                  {uri ? (
                    <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  ) : null}
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-semibold text-inkLight dark:text-ink" numberOfLines={1}>
                    {entry.movieTitle}
                  </Text>
                  {entry.rating > 0 ? <StarRating rating={entry.rating} size={13} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
