import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomSheet } from '@/components/common/bottom-sheet';
import { Button } from '@/components/common/button';
import { Chip } from '@/components/common/chip';
import {
  LANGUAGE_OPTIONS,
  RATING_OPTIONS,
  RUNTIME_OPTIONS,
  SORT_OPTIONS,
  YEAR_OPTIONS,
} from '@/constants/filters';
import { BROWSE_GENRES } from '@/constants/genres';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { DiscoverFilters } from '@/types';

export interface SearchFilterSheetHandle {
  present: () => void;
  dismiss: () => void;
}

interface SearchFilterSheetProps {
  filters: DiscoverFilters;
  onApply: (filters: DiscoverFilters) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-2.5 mt-5 text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
      {children}
    </Text>
  );
}

export const SearchFilterSheet = forwardRef<SearchFilterSheetHandle, SearchFilterSheetProps>(
  function SearchFilterSheet({ filters, onApply }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState<DiscoverFilters>(filters);
    const snapPoints = useMemo(() => ['85%'], []);
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();

    useImperativeHandle(ref, () => ({
      present: () => {
        setDraft(filters);
        setIsOpen(true);
      },
      dismiss: () => setIsOpen(false),
    }));

    // Fires when the sheet finishes animating to a snap point (including
    // -1 = closed, whether that came from our own state or a user gesture
    // like swiping down or tapping the backdrop) — keeps `isOpen` in sync.
    const handleSheetChange = useCallback((index: number) => {
      setIsOpen(index >= 0);
    }, []);

    const runtimeSelected = (min?: number, max?: number) =>
      draft.minRuntime === min && draft.maxRuntime === max;

    const handleReset = () => setDraft({});

    const handleApply = () => {
      onApply(draft);
      setIsOpen(false);
    };

    return (
      <AppBottomSheet
        index={isOpen ? 0 : -1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}>
        <View
          style={{ borderBottomColor: colors.border }}
          className="gap-3 border-b px-5 pb-4 pt-1">
          <Text className="text-lg font-bold text-inkLight dark:text-ink">Filters</Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Reset" variant="secondary" size="sm" onPress={handleReset} />
            </View>
            <View className="flex-1">
              <Button label="Apply filters" size="sm" onPress={handleApply} />
            </View>
          </View>
        </View>

        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
          }}>
          <SectionTitle>Genre</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={!draft.genreId}
              onPress={() => setDraft((d) => ({ ...d, genreId: undefined }))}
            />
            {BROWSE_GENRES.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                selected={draft.genreId === genre.id}
                onPress={() => setDraft((d) => ({ ...d, genreId: genre.id }))}
              />
            ))}
          </View>

          <SectionTitle>Release year</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={!draft.year}
              onPress={() => setDraft((d) => ({ ...d, year: undefined }))}
            />
            {YEAR_OPTIONS.map((year) => (
              <Chip
                key={year}
                label={String(year)}
                selected={draft.year === year}
                onPress={() => setDraft((d) => ({ ...d, year }))}
              />
            ))}
          </View>

          <SectionTitle>Minimum rating</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={!draft.minRating}
              onPress={() => setDraft((d) => ({ ...d, minRating: undefined }))}
            />
            {RATING_OPTIONS.map((rating) => (
              <Chip
                key={rating}
                label={`${rating}+`}
                selected={draft.minRating === rating}
                onPress={() => setDraft((d) => ({ ...d, minRating: rating }))}
              />
            ))}
          </View>

          <SectionTitle>Language</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={!draft.language}
              onPress={() => setDraft((d) => ({ ...d, language: undefined }))}
            />
            {LANGUAGE_OPTIONS.map((lang) => (
              <Chip
                key={lang.code}
                label={lang.label}
                selected={draft.language === lang.code}
                onPress={() => setDraft((d) => ({ ...d, language: lang.code }))}
              />
            ))}
          </View>

          <SectionTitle>Runtime</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Any"
              selected={!draft.minRuntime && !draft.maxRuntime}
              onPress={() => setDraft((d) => ({ ...d, minRuntime: undefined, maxRuntime: undefined }))}
            />
            {RUNTIME_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={runtimeSelected(option.min, option.max)}
                onPress={() =>
                  setDraft((d) => ({ ...d, minRuntime: option.min, maxRuntime: option.max }))
                }
              />
            ))}
          </View>

          <SectionTitle>Sort by</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={(draft.sortBy ?? 'popularity.desc') === option.value}
                onPress={() => setDraft((d) => ({ ...d, sortBy: option.value }))}
              />
            ))}
          </View>
        </BottomSheetScrollView>
      </AppBottomSheet>
    );
  }
);
