import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorView } from '@/components/common/error-view';
import { MovieCard } from '@/components/movie/movie-card';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { TmdbMovieSummary } from '@/types';

const CARD_GAP = 12;
const H_PADDING = 16;
const CARD_WIDTH = (360 - H_PADDING * 2 - CARD_GAP * 2) / 3;

interface MovieGridScreenProps {
  title: string;
  movies: TmdbMovieSummary[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onEndReached?: () => void;
}

export function MovieGridScreen({
  title,
  movies,
  isLoading,
  isError,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onEndReached,
}: MovieGridScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center gap-3 px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text className="flex-1 text-xl font-extrabold text-inkLight dark:text-ink" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.tint} />
        </View>
      ) : isError ? (
        <ErrorView onRetry={onRetry} />
      ) : movies.length === 0 ? (
        <EmptyState icon="film-outline" title="Nothing here yet" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          columnWrapperStyle={{ gap: CARD_GAP, paddingHorizontal: H_PADDING }}
          contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 24 }}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReached}
          renderItem={({ item }) => <MovieCard movie={item} width={CARD_WIDTH} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={colors.tint} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
