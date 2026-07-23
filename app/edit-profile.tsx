import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/common';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useProfile, useUpdateProfile } from '@/hooks/queries';
import { getSupabaseErrorMessage } from '@/services/supabase';

const MAX_BIO_WORDS = 200;

const countWords = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Prefill once the profile loads.
  useEffect(() => {
    if (profile && !hydrated) {
      setDisplayName(profile.display_name ?? '');
      setBio(profile.bio ?? '');
      setLocation(profile.location ?? '');
      setHydrated(true);
    }
  }, [profile, hydrated]);

  const bioWords = countWords(bio);
  const bioTooLong = bioWords > MAX_BIO_WORDS;
  const canSave = !updateProfile.isPending && !bioTooLong;

  const handleSave = () => {
    if (!canSave) return;
    updateProfile.mutate(
      {
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
      },
      {
        onSuccess: () => router.back(),
        onError: (error) => Alert.alert("Couldn't save profile", getSupabaseErrorMessage(error)),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View style={{ paddingTop: insets.top + 12 }} className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text className="text-sm font-semibold text-inkLight-muted dark:text-ink-muted">Cancel</Text>
        </Pressable>
        <Text className="text-base font-bold text-inkLight dark:text-ink">Edit profile</Text>
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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: insets.bottom + 32 }}>
          <Input
            label="Display name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            autoCapitalize="words"
            maxLength={60}
          />

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Country"
            autoCapitalize="words"
            maxLength={60}
            leftIcon={<Ionicons name="location-outline" size={18} color={colors.textMuted} />}
          />

          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-medium uppercase tracking-wide text-inkLight-muted dark:text-ink-muted">
                Bio
              </Text>
              <Text
                className={[
                  'text-xs font-medium',
                  bioTooLong ? 'text-red-500' : 'text-inkLight-muted dark:text-ink-muted',
                ].join(' ')}>
                {bioWords}/{MAX_BIO_WORDS} words
              </Text>
            </View>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people about your taste in films…"
              placeholderTextColor={colors.textFaint}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className={[
                'min-h-[120px] rounded-sm border bg-surface-light-soft p-3.5 text-sm text-inkLight dark:bg-base-soft dark:text-ink',
                bioTooLong ? 'border-red-500' : 'border-surface-light-border dark:border-base-border',
              ].join(' ')}
            />
            {bioTooLong ? (
              <Text className="text-xs text-red-500">
                Your bio is {bioWords - MAX_BIO_WORDS} word(s) over the {MAX_BIO_WORDS}-word limit.
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
