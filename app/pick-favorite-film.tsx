import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/common';
import { useAddFavoriteFilm, useSearchMovies } from '@/hooks/queries';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getSupabaseErrorMessage } from '@/services/supabase';
import { releaseYear } from '@/utils/format';
import { posterUrl } from '@/utils/image';
import type { TmdbMovieSummary } from '@/types';

export default function PickFavoriteFilmScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const addFavoriteFilm = useAddFavoriteFilm();

  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 350);
  const search = useSearchMovies(debounced);
  const results = search.data?.pages.flatMap((page) => page.results) ?? [];

  const handlePick = (movie: TmdbMovieSummary) => {
    addFavoriteFilm.mutate(movie, {
      onSuccess: () => router.back(),
      onError: (error) => Alert.alert("Couldn't add film", getSupabaseErrorMessage(error)),
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text className="text-sm font-semibold text-inkLight-muted dark:text-ink-muted">Cancel</Text>
        </Pressable>
        <Text className="text-base font-bold text-inkLight dark:text-ink">Add favourite film</Text>
        <View style={{ width: 48 }} />
      </View>

      <View className="px-4 pb-3">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Search for a film…"
          leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          autoFocus
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        <View className="flex-row flex-wrap gap-3">
          {results.map((movie) => (
            <SelectableFilmCard
              key={movie.id}
              movie={movie}
              disabled={addFavoriteFilm.isPending}
              onSelect={() => handlePick(movie)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * A poster tile used only for picking a favourite film. Deliberately NOT the
 * shared `MovieCard` — this must never navigate to the movie detail; the only
 * thing a tap can do is add the film to the showcase.
 */
function SelectableFilmCard({
  movie,
  disabled,
  onSelect,
}: {
  movie: TmdbMovieSummary;
  disabled: boolean;
  onSelect: () => void;
}) {
  const uri = posterUrl(movie.poster_path);
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={{ width: 100 }}
      className="active:opacity-70">
      <View
        style={{ height: 150 }}
        className="overflow-hidden rounded-md bg-surface-light-soft dark:bg-base-soft">
        {uri ? (
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <View className="flex-1 items-center justify-center p-1">
            <Text className="text-center text-[10px] text-inkLight-muted dark:text-ink-muted">
              {movie.title}
            </Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} className="mt-1.5 text-xs font-semibold text-inkLight dark:text-ink">
        {movie.title}
      </Text>
      <Text className="text-[11px] text-inkLight-muted dark:text-ink-muted">
        {releaseYear(movie.release_date)}
      </Text>
    </Pressable>
  );
}
