import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CinematicTimeline,
  CountryDetailSheet,
  CountryStatsCard,
  InteractiveWorldGlobe,
} from '@/components/map';
import { useIsAuthenticated } from '@/store/auth-store';
import { useMapData } from '@/hooks/use-map-data';

const { height: SCREEN_H } = Dimensions.get('window');
const MAP_HEIGHT = Math.round(SCREEN_H * 0.46);

export default function MovieMapScreen() {
  const insets = useSafeAreaInsets();
  const isAuthenticated = useIsAuthenticated();
  const { countries, stats, timeline, recommendations, maxCount, loading } = useMapData();

  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const selectedCountry = useMemo(
    () => countries.find((c) => c.iso === selectedIso) ?? null,
    [countries, selectedIso]
  );

  const showEmpty = !loading && countries.length === 0;

  return (
    <View className="flex-1" style={{ backgroundColor: '#05070C' }}>
      <StatusBar style="light" />
      {/* cinematic background */}
      <LinearGradient
        colors={['#0A1024', '#070A12', '#05070C']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: MAP_HEIGHT * 0.15,
          alignSelf: 'center',
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: 'rgba(0,224,84,0.10)',
        }}
      />

      {/* header */}
      <View style={{ paddingTop: insets.top + 10 }} className="z-10 flex-row items-center justify-between px-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-white/10">
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
        <View className="items-center">
          <Text className="text-[10px] font-bold uppercase tracking-[3px] text-brand">Cinematic Atlas</Text>
          <Text className="text-base font-extrabold text-white">Your World of Cinema</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {!isAuthenticated ? (
        <Centered>
          <Text className="text-lg font-bold text-white">Sign in to see your atlas</Text>
          <Text className="mt-1 px-10 text-center text-sm text-white/50">
            Log films and watch your personal map of world cinema light up.
          </Text>
          <Pressable onPress={() => router.push('/auth')} className="mt-5 rounded-full bg-brand px-6 py-3">
            <Text className="font-bold text-black">Sign in</Text>
          </Pressable>
        </Centered>
      ) : showEmpty ? (
        <Centered>
          <Ionicons name="earth-outline" size={44} color="#00e054" />
          <Text className="mt-3 text-lg font-bold text-white">Your map is waiting</Text>
          <Text className="mt-1 px-10 text-center text-sm text-white/50">
            Log films from around the world and watch your cinematic universe come to life.
          </Text>
        </Centered>
      ) : (
        <>
          {/* globe hero */}
          <View style={{ height: MAP_HEIGHT }}>
            <InteractiveWorldGlobe
              countries={countries}
              maxCount={maxCount}
              topIso={stats.topCountry?.iso}
              onSelectCountry={setSelectedIso}
            />
          </View>

          {/* scrollable sections */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 40 }}>
            {/* 2x2 stat grid */}
            <View className="gap-3 px-4">
              <View className="flex-row gap-3">
                <CountryStatsCard
                  style={{ flex: 1 }}
                  icon="earth"
                  label="Countries Explored"
                  value={stats.totalCountries}
                  delay={120}
                />
                <CountryStatsCard
                  style={{ flex: 1 }}
                  icon="film"
                  label="Movies Watched"
                  value={stats.totalMovies}
                  delay={200}
                />
              </View>
              <View className="flex-row gap-3">
                <CountryStatsCard
                  style={{ flex: 1 }}
                  icon="trophy"
                  label="Most Explored"
                  value={stats.topCountry?.name ?? '—'}
                  flag={stats.topCountry?.flag}
                  accent="#FFC53D"
                  delay={280}
                />
                <CountryStatsCard
                  style={{ flex: 1 }}
                  icon="flame"
                  label="Current Favorite"
                  value={stats.currentFavorite?.name ?? '—'}
                  flag={stats.currentFavorite?.flag}
                  accent="#FF5A5F"
                  delay={360}
                />
              </View>
            </View>

            <Animated.View entering={FadeIn.duration(600)} className="pt-8">
              <SectionHeader
                overline="Exploration"
                title={`${stats.explorationPercentage}% of the world explored`}
                subtitle={`${stats.totalCountries} countries · ${stats.totalMovies} films`}
              />
              <ProgressBar percent={stats.explorationPercentage} />
            </Animated.View>

            {timeline.length > 0 ? (
              <View className="pt-8">
                <SectionHeader overline="Timeline" title="Your journey across cinema" />
                <View className="pt-4">
                  <CinematicTimeline timeline={timeline} />
                </View>
              </View>
            ) : null}

            {recommendations.length > 0 ? (
              <View className="pt-8">
                <SectionHeader
                  overline="Discovery"
                  title="Countries you haven't explored yet"
                  subtitle="New corners of world cinema to discover"
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingTop: 14 }}>
                  {recommendations.map((r, i) => (
                    <Animated.View
                      key={r.iso}
                      entering={FadeInDown.delay(i * 70).duration(500)}
                      style={{ width: 140 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                      <Text style={{ fontSize: 34 }}>{r.flag}</Text>
                      <Text className="mt-2 text-sm font-bold text-white">{r.name}</Text>
                      <Text className="mt-0.5 text-[11px] text-white/45">{r.tagline}</Text>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </>
      )}

      <CountryDetailSheet country={selectedCountry} onClose={() => setSelectedIso(null)} />
    </View>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View className="flex-1 items-center justify-center px-6">{children}</View>;
}

function SectionHeader({
  overline,
  title,
  subtitle,
}: {
  overline: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="px-4">
      <Text className="text-[10px] font-bold uppercase tracking-[2px] text-brand">{overline}</Text>
      <Text className="mt-1 text-xl font-extrabold text-white">{title}</Text>
      {subtitle ? <Text className="mt-0.5 text-sm text-white/45">{subtitle}</Text> : null}
    </View>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <View className="mt-3 px-4">
      <View className="h-2 overflow-hidden rounded-full bg-white/10">
        <View
          style={{ width: `${Math.max(3, Math.min(100, percent))}%` }}
          className="h-full rounded-full bg-brand"
        />
      </View>
    </View>
  );
}
