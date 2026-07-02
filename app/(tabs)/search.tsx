import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, ErrorView, Input } from '@/components/common';
import { MovieCard } from '@/components/movie';
import { SearchFilterSheet, type SearchFilterSheetHandle } from '@/components/movie/search-filter-sheet';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useDiscoverMovies, useSearchMovies, useTrendingSearches } from '@/hooks/queries';
import { useSearchStore } from '@/store/search-store';
import type { DiscoverFilters, TmdbMovieSummary } from '@/types';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const filterSheetRef = useRef<SearchFilterSheetHandle>(null);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const debouncedQuery = useDebouncedValue(query, 400);

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } =
    useSearchStore();
  const trendingSearches = useTrendingSearches();

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasFilters = Object.keys(filters).length > 0;

  const searchResult = useSearchMovies(debouncedQuery);
  const discoverResult = useDiscoverMovies(filters, !hasQuery && hasFilters);

  const active = hasQuery ? searchResult : discoverResult;
  const movies: TmdbMovieSummary[] = useMemo(
    () => active.data?.pages.flatMap((page) => page.results) ?? [],
    [active.data]
  );

  const showBrowsePrompt = !hasQuery && !hasFilters;

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="gap-3 px-4 pb-3">
        <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">Search</Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <Input
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => addRecentSearch(query)}
              placeholder="Search movies..."
              leftIcon={<Ionicons name="search" size={18} color={colors.textMuted} />}
              rightIcon={
                query.length > 0 ? (
                  <Pressable onPress={() => setQuery('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </Pressable>
                ) : undefined
              }
              returnKeyType="search"
              autoCorrect={false}
            />
          </View>
          <Pressable
            onPress={() => filterSheetRef.current?.present?.()}
            className={[
              'h-[46px] w-[46px] items-center justify-center rounded-sm border',
              hasFilters
                ? 'border-brand bg-brand/10'
                : 'border-surface-light-border bg-surface-light-soft dark:border-base-border dark:bg-base-soft',
            ].join(' ')}>
            <Ionicons name="options-outline" size={20} color={hasFilters ? colors.tint : colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {showBrowsePrompt ? (
        <FlatList
          data={[]}
          renderItem={null}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          ListHeaderComponent={
            <View className="gap-6 px-4 pt-2">
              {recentSearches.length > 0 ? (
                <View className="gap-2.5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-inkLight dark:text-ink">
                      Recent searches
                    </Text>
                    <Pressable onPress={clearRecentSearches}>
                      <Text className="text-xs font-semibold text-brand-dim dark:text-brand">
                        Clear
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <Pressable
                        key={term}
                        onPress={() => setQuery(term)}
                        className="flex-row items-center gap-1.5 rounded-full border border-surface-light-border bg-surface-light-soft px-3 py-2 dark:border-base-border dark:bg-base-soft">
                        <Text className="text-xs font-medium text-inkLight-muted dark:text-ink-muted">
                          {term}
                        </Text>
                        <Pressable onPress={() => removeRecentSearch(term)} hitSlop={6}>
                          <Ionicons name="close" size={12} color={colors.textFaint} />
                        </Pressable>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              <View className="gap-2.5">
                <Text className="text-sm font-bold text-inkLight dark:text-ink">
                  Trending searches
                </Text>
                <View className="gap-1">
                  {(trendingSearches.data ?? []).map((movie, index) => (
                    <Pressable
                      key={movie.id}
                      onPress={() => setQuery(movie.title)}
                      className="flex-row items-center gap-3 py-2.5">
                      <Text className="w-5 text-sm font-bold text-inkLight-faint dark:text-ink-faint">
                        {index + 1}
                      </Text>
                      <Text className="flex-1 text-sm text-inkLight dark:text-ink" numberOfLines={1}>
                        {movie.title}
                      </Text>
                      <Ionicons name="trending-up" size={14} color={colors.tint} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          }
        />
      ) : active.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-inkLight-muted dark:text-ink-muted">Searching…</Text>
        </View>
      ) : active.isError ? (
        <ErrorView onRetry={() => active.refetch()} />
      ) : movies.length === 0 ? (
        <EmptyState icon="search-outline" title="No results" message="Try a different search or adjust your filters." />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 16, paddingTop: 8, paddingBottom: insets.bottom + 110 }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (active.hasNextPage && !active.isFetchingNextPage) active.fetchNextPage();
          }}
          renderItem={({ item }) => <MovieCard movie={item} width={(360 - 32 - 24) / 3} />}
        />
      )}

      {hasFilters ? (
        <View className="absolute bottom-28 left-0 right-0 items-center">
          <View className="flex-row items-center gap-2 rounded-full bg-black/80 px-3 py-1.5">
            <Text className="text-xs font-medium text-white">Filters active</Text>
            <Pressable onPress={() => setFilters({})}>
              <Ionicons name="close" size={14} color="#fff" />
            </Pressable>
          </View>
        </View>
      ) : null}

      <SearchFilterSheet ref={filterSheetRef} filters={filters} onApply={setFilters} />
    </View>
  );
}
