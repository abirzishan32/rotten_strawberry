import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ThemeToggle } from '@/components/common';
import { useAppTheme } from '@/hooks/use-app-theme';
import { authApi } from '@/services/supabase';
import { useCurrentUser, useIsAuthenticated } from '@/store/auth-store';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authApi.signOut();
    } catch (error) {
      Alert.alert('Sign out failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center gap-3 px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text className="text-xl font-extrabold text-inkLight dark:text-ink">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <View className="gap-2.5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Account
          </Text>
          {isAuthenticated ? (
            <View className="gap-3">
              <View className="gap-0.5 rounded-md bg-surface-light-soft dark:bg-base-soft">
                <InfoRow label="Signed in as" value={user?.email ?? '—'} last />
              </View>
              <Button
                label="Sign out"
                variant="danger"
                onPress={handleSignOut}
                loading={signingOut}
                fullWidth
              />
            </View>
          ) : (
            <View className="gap-3 rounded-md bg-surface-light-soft p-4 dark:bg-base-soft">
              <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
                Sign in to sync your reviews, favorites, and watchlist across devices.
              </Text>
              <Button label="Sign in or create account" onPress={() => router.push('/auth')} fullWidth />
            </View>
          )}
        </View>

        <View className="gap-2.5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            Appearance
          </Text>
          <ThemeToggle />
        </View>

        <View className="gap-2.5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
            About
          </Text>
          <View className="gap-0.5 rounded-md bg-surface-light-soft dark:bg-base-soft">
            <InfoRow label="App version" value={Constants.expoConfig?.version ?? '1.0.0'} />
            <InfoRow label="Movie data" value="TMDB" last />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className={[
        'flex-row items-center justify-between px-4 py-3.5',
        last ? '' : 'border-b border-surface-light-border dark:border-base-border',
      ].join(' ')}>
      <Text className="text-sm text-inkLight dark:text-ink">{label}</Text>
      <Text className="text-sm text-inkLight-muted dark:text-ink-muted">{value}</Text>
    </View>
  );
}
