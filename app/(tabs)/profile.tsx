import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, EmptyState } from '@/components/common';
import { GenreChip, MovieCard } from '@/components/movie';
import { DiaryList, FavoriteFilmsRow } from '@/components/profile';
import { ReviewCard } from '@/components/review';
import { useAppTheme } from '@/hooks/use-app-theme';
import {
  useFavoriteFilms,
  useFavorites,
  useMyReviews,
  useProfile,
  useRemoveFavoriteFilm,
  useReorderFavoriteFilms,
  useWatchlist,
} from '@/hooks/queries';
import { useCurrentUser, useIsAuthenticated } from '@/store/auth-store';
import { computeDiaryStats } from '@/utils/stats';

type ProfileTab = 'diary' | 'reviews' | 'favorites' | 'watchlist';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  const { data: profile } = useProfile();
  const { data: entries = [] } = useMyReviews();
  const { data: favorites = [] } = useFavorites();
  const { data: watchlist = [] } = useWatchlist();
  const { data: favoriteFilms = [] } = useFavoriteFilms();
  const reorderFavoriteFilms = useReorderFavoriteFilms();
  const removeFavoriteFilm = useRemoveFavoriteFilm();
  const [tab, setTab] = useState<ProfileTab>('diary');

  const stats = useMemo(() => computeDiaryStats(entries), [entries]);
  const reviewedEntries = useMemo(
    () => entries.filter((entry) => entry.reviewText.trim().length > 0),
    [entries]
  );

  if (!isAuthenticated) {
    return <SignedOut insetsTop={insets.top} />;
  }

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Movie fan';
  const username = profile?.username || user?.email?.split('@')[0] || 'you';

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center justify-between px-4 pb-2">
          <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Profile</Text>
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.push('/map')} hitSlop={8}>
              <Ionicons name="earth-outline" size={22} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View className="items-center gap-3 px-4 pt-3">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-brand/15">
            <Ionicons name="person" size={40} color={colors.tint} />
          </View>
          <View className="items-center gap-0.5">
            <Text className="text-lg font-bold text-inkLight dark:text-ink">{displayName}</Text>
            <Text className="text-sm text-inkLight-muted dark:text-ink-muted">@{username}</Text>
          </View>
          {profile?.location ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text className="text-xs text-inkLight-muted dark:text-ink-muted">{profile.location}</Text>
            </View>
          ) : null}
          {profile?.bio ? (
            <Text className="max-w-[300px] text-center text-sm text-inkLight-muted dark:text-ink-muted">
              {profile.bio}
            </Text>
          ) : null}
          <Button
            label="Edit profile"
            variant="outline"
            size="sm"
            onPress={() => router.push('/edit-profile')}
          />
        </View>

        {/* Favourite films showcase (max 4, drag to reorder) */}
        <View className="gap-2.5 px-4 pt-7">
          <Text className="text-sm font-bold text-inkLight dark:text-ink">Favourite films</Text>
          {favoriteFilms.length === 0 ? (
            <Text className="text-xs text-inkLight-muted dark:text-ink-muted">
              Add up to 4 favourites and long-press to drag them into order.
            </Text>
          ) : null}
          <FavoriteFilmsRow
            films={favoriteFilms}
            editable
            onReorder={(movies) => reorderFavoriteFilms.mutate(movies)}
            onRemove={(movieId) => removeFavoriteFilm.mutate(movieId)}
            onAddPress={() => router.push('/pick-favorite-film')}
            onPressFilm={(movieId) => router.push(`/movie/${movieId}`)}
          />
        </View>

        <View className="mx-4 mt-7 flex-row rounded-md bg-surface-light-soft dark:bg-base-soft">
          <StatCell label="Watched" value={String(stats.totalWatched)} />
          <StatCell label="Reviews" value={String(stats.totalReviews)} />
          <StatCell label="Avg rating" value={stats.averageRating ? stats.averageRating.toFixed(1) : '—'} />
        </View>

        {/* Cinematic Atlas entry */}
        <Pressable onPress={() => router.push('/map')} className="mx-4 mt-4 overflow-hidden rounded-xl">
          <LinearGradient
            colors={['#0A1024', '#123a24']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 16 }}>
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-brand/20">
                <Ionicons name="earth" size={24} color="#00e054" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-white">Your Cinematic Atlas</Text>
                <Text className="text-xs text-white/60">See your world of cinema light up on the globe</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#00e054" />
            </View>
          </LinearGradient>
        </Pressable>

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

        <View className="flex-row flex-wrap gap-2 px-4 pb-4 pt-7">
          <TabButton label="Diary" active={tab === 'diary'} onPress={() => setTab('diary')} />
          <TabButton label="Reviews" active={tab === 'reviews'} onPress={() => setTab('reviews')} />
          <TabButton label="Favorites" active={tab === 'favorites'} onPress={() => setTab('favorites')} />
          <TabButton label="Watchlist" active={tab === 'watchlist'} onPress={() => setTab('watchlist')} />
        </View>

        {tab === 'diary' ? (
          entries.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="Your diary is empty"
              message="Log a movie to start building your diary."
            />
          ) : (
            <DiaryList entries={entries} onPressEntry={(movieId) => router.push(`/movie/${movieId}`)} />
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

        {tab === 'watchlist' ? (
          watchlist.length === 0 ? (
            <EmptyState
              icon="bookmark-outline"
              title="Your watchlist is empty"
              message="Tap the bookmark on a movie to save it for later."
            />
          ) : (
            <View className="flex-row flex-wrap gap-3 px-4">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} width={100} />
              ))}
            </View>
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

function SignedOut({ insetsTop }: { insetsTop: number }) {
  const { colors } = useAppTheme();
  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insetsTop + 12 }} className="flex-row items-center justify-between px-4 pb-2">
        <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Profile</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Pressable>
      </View>
      <View className="flex-1 items-center justify-center gap-5 px-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-brand/15">
          <Ionicons name="person-outline" size={36} color={colors.tint} />
        </View>
        <View className="items-center gap-1.5">
          <Text className="text-lg font-bold text-inkLight dark:text-ink">Sign in to your account</Text>
          <Text className="text-center text-sm text-inkLight-muted dark:text-ink-muted">
            Log films, write reviews, and build your watchlist — synced to your account.
          </Text>
        </View>
        <Button label="Sign in or create account" onPress={() => router.push('/auth')} />
      </View>
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
        'min-w-[72px] flex-1 items-center rounded-sm border py-2.5',
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
