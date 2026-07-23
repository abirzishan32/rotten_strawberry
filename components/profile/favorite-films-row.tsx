import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { MAX_FAVORITE_FILMS } from '@/hooks/queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { TmdbMovieSummary } from '@/types';
import { posterUrl } from '@/utils/image';

const GAP = 10;
const POSTER_RATIO = 1.5; // height / width

interface FavoriteFilmsRowProps {
  films: TmdbMovieSummary[];
  editable: boolean;
  onReorder: (movies: TmdbMovieSummary[]) => void;
  onRemove: (movieId: number) => void;
  onAddPress: () => void;
  onPressFilm?: (movieId: number) => void;
}

export function FavoriteFilmsRow({
  films,
  editable,
  onReorder,
  onRemove,
  onAddPress,
  onPressFilm,
}: FavoriteFilmsRowProps) {
  const { colors } = useAppTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width);

  const itemWidth =
    containerWidth > 0 ? (containerWidth - GAP * (MAX_FAVORITE_FILMS - 1)) / MAX_FAVORITE_FILMS : 0;
  const itemHeight = itemWidth * POSTER_RATIO;

  const move = (from: number, to: number) => {
    if (from === to) return;
    const next = [...films];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };

  const emptySlots = editable ? Math.max(0, MAX_FAVORITE_FILMS - films.length) : 0;

  return (
    <View onLayout={onLayout} style={{ flexDirection: 'row', gap: GAP }}>
      {itemWidth > 0
        ? films.map((movie, index) => (
            <DraggableFilm
              key={movie.id}
              movie={movie}
              index={index}
              count={films.length}
              width={itemWidth}
              height={itemHeight}
              editable={editable}
              onMove={move}
              onRemove={onRemove}
              onPress={onPressFilm}
            />
          ))
        : null}

      {itemWidth > 0 &&
        Array.from({ length: emptySlots }).map((_, i) => (
          <Pressable
            key={`empty-${i}`}
            onPress={onAddPress}
            style={{ width: itemWidth, height: itemHeight }}
            className="items-center justify-center rounded-sm border border-dashed border-surface-light-border dark:border-base-border">
            <Ionicons name="add" size={24} color={colors.textFaint} />
          </Pressable>
        ))}
    </View>
  );
}

interface DraggableFilmProps {
  movie: TmdbMovieSummary;
  index: number;
  count: number;
  width: number;
  height: number;
  editable: boolean;
  onMove: (from: number, to: number) => void;
  onRemove: (movieId: number) => void;
  onPress?: (movieId: number) => void;
}

function DraggableFilm({
  movie,
  index,
  count,
  width,
  height,
  editable,
  onMove,
  onRemove,
  onPress,
}: DraggableFilmProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const lifted = useSharedValue(0);
  const uri = posterUrl(movie.poster_path, 'w342');

  // Long-press to pick up, then drag horizontally to a new slot; snaps back and
  // reorders on release. Pitch = item width + gap between items.
  const pan = Gesture.Pan()
    .enabled(editable && count > 1)
    .activateAfterLongPress(220)
    .onStart(() => {
      scale.value = withSpring(1.08);
      lifted.value = 1;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      const pitch = width + GAP;
      let target = Math.round(index + e.translationX / pitch);
      if (target < 0) target = 0;
      if (target > count - 1) target = count - 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      lifted.value = 0;
      if (target !== index) runOnJS(onMove)(index, target);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: lifted.value ? 100 : 0,
    elevation: lifted.value ? 8 : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width }, animatedStyle]}>
        <Pressable onPress={() => onPress?.(movie.id)} disabled={!onPress}>
          <View
            style={{ height }}
            className="overflow-hidden rounded-sm bg-surface-light-soft dark:bg-base-soft">
            {uri ? (
              <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="px-1 text-center text-[10px] text-inkLight-muted dark:text-ink-muted">
                  {movie.title}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
        {editable ? (
          <Pressable
            onPress={() => onRemove(movie.id)}
            hitSlop={8}
            className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full bg-black/80">
            <Ionicons name="close" size={12} color="#fff" />
          </Pressable>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}
