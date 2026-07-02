import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { Chip } from '@/components/common/chip';
import { BROWSE_GENRES } from '@/constants/genres';

export function CategoryChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
      {BROWSE_GENRES.map((genre) => (
        <Chip
          key={genre.id}
          label={genre.name}
          onPress={() =>
            router.push({ pathname: '/browse/genre/[id]', params: { id: String(genre.id), name: genre.name } })
          }
        />
      ))}
    </ScrollView>
  );
}
