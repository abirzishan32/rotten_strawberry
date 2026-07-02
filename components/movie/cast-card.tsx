import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { TmdbCastMember } from '@/types';
import { profileUrl } from '@/utils/image';

export function CastCard({ member }: { member: TmdbCastMember }) {
  const { colors } = useAppTheme();
  const uri = profileUrl(member.profile_path);

  return (
    <View style={{ width: 92 }}>
      <View className="h-28 w-full items-center justify-center overflow-hidden rounded-md bg-surface-light-soft dark:bg-base-soft">
        {uri ? (
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        ) : (
          <Ionicons name="person" size={28} color={colors.textFaint} />
        )}
      </View>
      <Text numberOfLines={1} className="mt-2 text-xs font-semibold text-inkLight dark:text-ink">
        {member.name}
      </Text>
      <Text numberOfLines={1} className="text-[11px] text-inkLight-muted dark:text-ink-muted">
        {member.character}
      </Text>
    </View>
  );
}
