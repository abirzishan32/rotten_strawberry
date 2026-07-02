import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/common';
import { GenreChip, MovieCard } from '@/components/movie';
import { ReviewCard } from '@/components/review';
import { MOCK_PROFILE } from '@/constants/mock-profile';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useFavoritesStore } from '@/store/favorites-store';
import { useLogStore } from '@/store/log-store';
import { computeDiaryStats } from '@/utils/stats';
import { posterUrl } from '@/utils/image';

type ProfileTab = 'diary' | 'reviews' | 'favorites';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const entries = useLogStore((s) => s.entries);
  const favorites = useFavoritesStore((s) => s.favorites);
  const [tab, setTab] = useState<ProfileTab>('diary');

  const stats = useMemo(() => computeDiaryStats(entries), [entries]);
  const reviewedEntries = useMemo(
    () => entries.filter((entry) => entry.reviewText.trim().length > 0),
    [entries]
  );

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center justify-between px-4 pb-2">
          <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Profile</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View className="items-center gap-3 px-4 pt-3">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-brand/15">
            <Ionicons name="person" size={40} color={colors.tint} />
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-lg font-bold text-inkLight dark:text-ink">
              {MOCK_PROFILE.displayName}
            </Text>
            <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
              @{MOCK_PROFILE.username}
            </Text>
          </View>
          <Text className="max-w-[280px] text-center text-sm text-inkLight-muted dark:text-ink-muted">
            {MOCK_PROFILE.bio}
          </Text>

          <View className="flex-row gap-8 pt-2">
            <View className="items-center">
              <Text className="text-base font-bold text-inkLight dark:text-ink">
                {MOCK_PROFILE.followers}
              </Text>
              <Text className="text-xs text-inkLight-muted dark:text-ink-muted">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-base font-bold text-inkLight dark:text-ink">
                {MOCK_PROFILE.following}
              </Text>
              <Text className="text-xs text-inkLight-muted dark:text-ink-muted">Following</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 mt-6 flex-row rounded-md bg-surface-light-soft dark:bg-base-soft">
          <StatCell label="Watched" value={String(stats.totalWatched)} />
          <StatCell label="Reviews" value={String(stats.totalReviews)} />
          <StatCell label="Avg rating" value={stats.averageRating ? stats.averageRating.toFixed(1) : '—'} />
        </View>

        {stats.topGenres.length > 0 ? (
          <View className="gap-2.5 px-4 pt-6">
            <Text className="text-sm font-bold text-inkLight dark:text-ink">Favorite genres</Text>
            <View className="flex-row flex-wrap gap-2">
              {stats.topGenres.map((genre) => (
                <GenreChip key={genre} name={genre} />
              ))}
            </View>
          </View>
        ) : null}

        <View className="flex-row gap-2 px-4 pb-4 pt-7">
          <TabButton label="Diary" active={tab === 'diary'} onPress={() => setTab('diary')} />
          <TabButton label="Reviews" active={tab === 'reviews'} onPress={() => setTab('reviews')} />
          <TabButton label="Favorites" active={tab === 'favorites'} onPress={() => setTab('favorites')} />
        </View>

        {tab === 'diary' ? (
          entries.length === 0 ? (
            <EmptyState
              icon="book-outline"
              title="Your diary is empty"
              message="Log a movie to start building your diary."
            />
          ) : (
            <View className="flex-row flex-wrap gap-3 px-4">
              {entries.map((entry) => (
                <Pressable
                  key={entry.id}
                  onPress={() => router.push(`/movie/${entry.movieId}`)}
                  style={{ width: 88 }}>
                  <View className="h-32 w-full overflow-hidden rounded-sm bg-surface-light-soft dark:bg-base-soft">
                    {posterUrl(entry.posterPath, 'w185') ? (
                      <Image
                        source={{ uri: posterUrl(entry.posterPath, 'w185') ?? undefined }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                      />
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          )
        ) : null}

        {tab === 'reviews' ? (
          reviewedEntries.length === 0 ? (
            <EmptyState icon="chatbox-outline" title="No reviews yet" message="Write a review when logging a movie." />
          ) : (
            <View className="gap-3 px-4">
              {reviewedEntries.map((entry) => (
                <ReviewCard key={entry.id} entry={entry} />
              ))}
            </View>
          )
        ) : null}

        {tab === 'favorites' ? (
          favorites.length === 0 ? (
            <EmptyState icon="heart-outline" title="No favorites yet" message="Tap the heart on a movie to favorite it." />
          ) : (
            <View className="flex-row flex-wrap gap-3 px-4">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} width={100} />
              ))}
            </View>
          )
        ) : null}

        <View className="gap-2.5 px-4 pt-8">
          <Text className="text-sm font-bold text-inkLight dark:text-ink">Lists</Text>
          <View className="items-center gap-2 rounded-md bg-surface-light-soft py-8 dark:bg-base-soft">
            <Ionicons name="albums-outline" size={22} color={colors.textFaint} />
            <Text className="text-xs text-inkLight-muted dark:text-ink-muted">
              No custom lists yet
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1 py-4">
      <Text className="text-base font-bold text-inkLight dark:text-ink">{value}</Text>
      <Text className="text-[11px] text-inkLight-muted dark:text-ink-muted">{label}</Text>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-1 items-center rounded-sm border py-2.5',
        active ? 'border-brand bg-brand/10' : 'border-surface-light-border dark:border-base-border',
      ].join(' ')}>
      <Text
        className={[
          'text-xs font-semibold',
          active ? 'text-brand-dim dark:text-brand' : 'text-inkLight-muted dark:text-ink-muted',
        ].join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
}
