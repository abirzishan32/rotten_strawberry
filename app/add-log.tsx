import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Input } from '@/components/common';
import { MovieCard } from '@/components/movie';
import { StarRating } from '@/components/review';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useCreateReview, useMovieDetails, useSearchMovies } from '@/hooks/queries';
import { getSupabaseErrorMessage } from '@/services/supabase';
import { REVIEW_METRICS, type PrivacyLevel, type ReviewMetricKey } from '@/types';
import { formatDate } from '@/utils/format';
import { posterUrl } from '@/utils/image';

const PRIVACY_OPTIONS: { value: PrivacyLevel; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'public', label: 'Public', icon: 'globe-outline' },
  { value: 'friends', label: 'Friends', icon: 'people-outline' },
  { value: 'private', label: 'Private', icon: 'lock-closed-outline' },
];

interface SelectedMovie {
  id: number;
  title: string;
  posterPath: string | null;
  genreIds: number[];
}

export default function AddLogScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ movieId?: string; title?: string; poster?: string }>();
  const createReview = useCreateReview();

  const prefilledMovieId = params.movieId ? Number(params.movieId) : undefined;
  const prefilledDetails = useMovieDetails(prefilledMovieId ?? NaN);

  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(
    prefilledMovieId
      ? {
          id: prefilledMovieId,
          title: params.title ?? '',
          posterPath: params.poster || null,
          genreIds: [],
        }
      : null
  );

  const [movieQuery, setMovieQuery] = useState('');
  const debouncedMovieQuery = useDebouncedValue(movieQuery, 350);
  const movieSearch = useSearchMovies(debouncedMovieQuery);
  const searchResults = movieSearch.data?.pages.flatMap((page) => page.results) ?? [];

  const [metrics, setMetrics] = useState<Record<ReviewMetricKey, number>>({
    rating: 0,
    ratingEnding: 0,
    ratingRewatchability: 0,
    ratingPacing: 0,
  });
  const setMetric = (key: ReviewMetricKey, value: number) =>
    setMetrics((prev) => ({ ...prev, [key]: value }));
  const [reviewText, setReviewText] = useState('');
  const [watched, setWatched] = useState(true);
  const [watchedDate, setWatchedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [liked, setLiked] = useState(false);
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacyLevel>('public');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const effectiveGenreIds =
    selectedMovie?.id === prefilledMovieId && prefilledDetails.data
      ? prefilledDetails.data.genres.map((g) => g.id)
      : (selectedMovie?.genreIds ?? []);

  const addTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) setTags((prev) => [...prev, cleaned]);
    setTagInput('');
  };

  const canSave = !!selectedMovie && metrics.rating > 0 && !createReview.isPending;

  const handleSave = () => {
    if (!selectedMovie || createReview.isPending) return;
    createReview.mutate(
      {
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        posterPath: selectedMovie.posterPath,
        genreIds: effectiveGenreIds,
        rating: metrics.rating,
        ratingEnding: metrics.ratingEnding,
        ratingRewatchability: metrics.ratingRewatchability,
        ratingPacing: metrics.ratingPacing,
        reviewText,
        watched,
        watchedDate: watchedDate.toISOString(),
        liked,
        containsSpoilers,
        tags,
        privacy,
      },
      {
        onSuccess: () => router.back(),
        onError: (error) => Alert.alert("Couldn't save your log", getSupabaseErrorMessage(error)),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text className="text-sm font-semibold text-inkLight-muted dark:text-ink-muted">Cancel</Text>
        </Pressable>
        <Text className="text-base font-bold text-inkLight dark:text-ink">Log a movie</Text>
        <Pressable onPress={handleSave} disabled={!canSave} hitSlop={10}>
          <Text
            className={[
              'text-sm font-bold',
              canSave ? 'text-brand-dim dark:text-brand' : 'text-inkLight-faint dark:text-ink-faint',
            ].join(' ')}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 22, paddingBottom: insets.bottom + 32 }}>
        {selectedMovie ? (
          <View className="flex-row items-center gap-3 rounded-md bg-surface-light-soft p-3 dark:bg-base-soft">
            <View className="h-20 w-14 overflow-hidden rounded-sm bg-surface-light-border dark:bg-base-elevated">
              {posterUrl(selectedMovie.posterPath, 'w185') ? (
                <Image
                  source={{ uri: posterUrl(selectedMovie.posterPath, 'w185') ?? undefined }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : null}
            </View>
            <Text className="flex-1 text-base font-semibold text-inkLight dark:text-ink">
              {selectedMovie.title}
            </Text>
            <Pressable onPress={() => setSelectedMovie(null)} hitSlop={8}>
              <Text className="text-xs font-semibold text-brand-dim dark:text-brand">Change</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            <Input
              value={movieQuery}
              onChangeText={setMovieQuery}
              placeholder="Search for a movie to log..."
              leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
              autoFocus
            />
            {searchResults.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {searchResults.slice(0, 10).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    width={100}
                    onPress={() =>
                      setSelectedMovie({
                        id: movie.id,
                        title: movie.title,
                        posterPath: movie.poster_path,
                        genreIds: movie.genre_ids,
                      })
                    }
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>
        )}

        <View className="gap-3 rounded-md bg-surface-light-soft p-4 dark:bg-base-soft">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Your ratings
          </Text>
          {REVIEW_METRICS.map((metric) => (
            <View key={metric.key} className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-inkLight dark:text-ink">{metric.label}</Text>
              <StarRating
                rating={metrics[metric.key]}
                onChange={(value) => setMetric(metric.key, value)}
                size={24}
              />
            </View>
          ))}
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Review
          </Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="What did you think?"
            placeholderTextColor={colors.textFaint}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="min-h-[120px] rounded-sm border border-surface-light-border bg-surface-light-soft p-3.5 text-sm text-inkLight dark:border-base-border dark:bg-base-soft dark:text-ink"
          />
        </View>

        <View className="flex-row items-center justify-between rounded-md bg-surface-light-soft px-4 py-3.5 dark:bg-base-soft">
          <Text className="text-sm font-medium text-inkLight dark:text-ink">Watched</Text>
          <Switch
            value={watched}
            onValueChange={setWatched}
            trackColor={{ false: colors.border, true: colors.tint }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="flex-row items-center justify-between rounded-md bg-surface-light-soft px-4 py-3.5 dark:bg-base-soft">
          <Text className="text-sm font-medium text-inkLight dark:text-ink">Watch date</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
              {formatDate(watchedDate.toISOString())}
            </Text>
            <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
          </View>
        </Pressable>
        {showDatePicker ? (
          <DateTimePicker
            value={watchedDate}
            mode="date"
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setWatchedDate(date);
            }}
          />
        ) : null}

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setLiked((v) => !v)}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-surface-light-soft py-3.5 dark:bg-base-soft">
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? '#ff8000' : colors.textMuted} />
            <Text className="text-sm font-medium text-inkLight dark:text-ink">Liked</Text>
          </Pressable>
          <Pressable
            onPress={() => setContainsSpoilers((v) => !v)}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-md bg-surface-light-soft py-3.5 dark:bg-base-soft">
            <Ionicons
              name={containsSpoilers ? 'eye-off' : 'eye-off-outline'}
              size={18}
              color={containsSpoilers ? colors.tint : colors.textMuted}
            />
            <Text className="text-sm font-medium text-inkLight dark:text-ink">Spoilers</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Tags
          </Text>
          <Input
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addTag}
            placeholder="Add a tag and press enter"
            returnKeyType="done"
          />
          {tags.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  className="flex-row items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5">
                  <Text className="text-xs font-medium text-brand-dim dark:text-brand">#{tag}</Text>
                  <Ionicons name="close" size={11} color={colors.tint} />
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Who can see this
          </Text>
          <View className="flex-row gap-2">
            {PRIVACY_OPTIONS.map((option) => {
              const active = privacy === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setPrivacy(option.value)}
                  className={[
                    'flex-1 flex-row items-center justify-center gap-1.5 rounded-md border py-3',
                    active
                      ? 'border-brand bg-brand/10'
                      : 'border-surface-light-border dark:border-base-border',
                  ].join(' ')}>
                  <Ionicons name={option.icon} size={15} color={active ? colors.tint : colors.textMuted} />
                  <Text
                    className={[
                      'text-xs font-medium',
                      active ? 'text-inkLight dark:text-ink' : 'text-inkLight-muted dark:text-ink-muted',
                    ].join(' ')}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button
          label="Save log"
          onPress={handleSave}
          disabled={!canSave}
          loading={createReview.isPending}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}
