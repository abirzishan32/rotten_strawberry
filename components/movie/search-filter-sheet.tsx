import {
  BottomSheetFooter,
  BottomSheetScrollView,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBottomSheet, type AppBottomSheetRef } from '@/components/common/bottom-sheet';
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

const FOOTER_HEIGHT = 84;

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
    const sheetRef = useRef<AppBottomSheetRef>(null);
    const [draft, setDraft] = useState<DiscoverFilters>(filters);
    const snapPoints = useMemo(() => ['85%'], []);
    const insets = useSafeAreaInsets();
    const { colors } = useAppTheme();

    useImperativeHandle(ref, () => ({
      present: () => {
        setDraft(filters);
        sheetRef.current?.present();
      },
      dismiss: () => sheetRef.current?.dismiss(),
    }));

    const runtimeSelected = (min?: number, max?: number) =>
      draft.minRuntime === min && draft.maxRuntime === max;

    const renderFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <BottomSheetFooter {...footerProps} bottomInset={insets.bottom}>
          <View
            style={{ borderTopColor: colors.border, backgroundColor: colors.backgroundElevated }}
            className="flex-row gap-3 border-t px-5 pb-3 pt-3">
            <View className="flex-1">
              <Button
                label="Reset"
                variant="secondary"
                onPress={() => {
                  setDraft({});
                }}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Apply filters"
                onPress={() => {
                  onApply(draft);
                  sheetRef.current?.dismiss();
                }}
              />
            </View>
          </View>
        </BottomSheetFooter>
      ),
      [colors.backgroundElevated, colors.border, draft, insets.bottom, onApply]
    );

    return (
      <AppBottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        index={0}
        footerComponent={renderFooter}>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: FOOTER_HEIGHT + insets.bottom + 16,
          }}>
          <Text className="text-lg font-bold text-inkLight dark:text-ink">Filters</Text>

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
