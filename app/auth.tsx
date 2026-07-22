import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Input } from '@/components/common';
import { useAppTheme } from '@/hooks/use-app-theme';
import { authApi } from '@/services/supabase';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isSignUp = mode === 'signup';

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const validate = () => {
    if (!email.trim()) return 'Enter your email address.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'That email address looks invalid.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (isSignUp) {
        const data = await authApi.signUp({ email, password, displayName });
        // If email confirmation is on, there's no session yet — guide the user.
        if (!data.session) {
          setInfo('Account created. Check your email to confirm, then sign in.');
          setMode('signin');
          return;
        }
      } else {
        await authApi.signIn(email, password);
      }
      // Auth state listener updates the store; close the modal.
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-base">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center justify-between px-4 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-base font-bold text-inkLight dark:text-ink">
          {isSignUp ? 'Create account' : 'Sign in'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: insets.bottom + 40 }}>
          <View className="items-center gap-3 pb-2 pt-4">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand/15">
              <Ionicons name="film" size={30} color={colors.tint} />
            </View>
            <Text className="text-2xl font-extrabold text-inkLight dark:text-ink">
              {isSignUp ? 'Join Rotten Strawberry' : 'Welcome back'}
            </Text>
            <Text className="text-center text-sm text-inkLight-muted dark:text-ink-muted">
              {isSignUp
                ? 'Create an account to log films, write reviews, and build your watchlist.'
                : 'Sign in to sync your reviews, favorites, and watchlist.'}
            </Text>
          </View>

          <View className="flex-row rounded-md bg-surface-light-soft p-1 dark:bg-base-soft">
            <SegmentButton label="Sign in" active={!isSignUp} onPress={() => switchMode('signin')} />
            <SegmentButton label="Create account" active={isSignUp} onPress={() => switchMode('signup')} />
          </View>

          <View className="gap-4">
            {isSignUp ? (
              <Input
                label="Display name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="How should we call you?"
                autoCapitalize="words"
                leftIcon={<Ionicons name="person-outline" size={18} color={colors.textMuted} />}
              />
            ) : null}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              secureTextEntry
              autoCapitalize="none"
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />}
            />

            {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
            {info ? <Text className="text-sm text-brand-dim dark:text-brand">{info}</Text> : null}

            <Button
              label={isSignUp ? 'Create account' : 'Sign in'}
              onPress={handleSubmit}
              loading={loading}
              fullWidth
            />
          </View>

          <Pressable onPress={() => switchMode(isSignUp ? 'signin' : 'signup')} className="items-center py-2">
            <Text className="text-sm text-inkLight-muted dark:text-ink-muted">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text className="font-bold text-brand-dim dark:text-brand">
                {isSignUp ? 'Sign in' : 'Create one'}
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SegmentButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={['flex-1 items-center rounded-sm py-2.5', active ? 'bg-white dark:bg-base-elevated' : ''].join(' ')}>
      <Text
        className={[
          'text-sm font-semibold',
          active ? 'text-inkLight dark:text-ink' : 'text-inkLight-muted dark:text-ink-muted',
        ].join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
}
