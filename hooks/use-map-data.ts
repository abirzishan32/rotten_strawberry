import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  COUNTRY_GEO,
  NOTABLE_CINEMAS,
  PLOTTABLE_COUNTRY_COUNT,
  isoToFlag,
  type Continent,
} from '@/constants/country-geo';
import { queryKeys } from '@/constants/query-keys';
import { useMyReviews } from '@/hooks/queries';
import { fetchMovieDetails } from '@/services/tmdb';
import type { MovieLogEntry } from '@/types';

export interface CountryMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
  rating: number;
  watchedDate: string;
}

export interface CountryStat {
  iso: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  continent: Continent;
  moviesWatched: number;
  averageRating: number;
  movies: CountryMovie[]; // sorted best-rated first
  firstWatchedDate: string;
  lastWatchedDate: string;
}

export interface UserMapStats {
  totalCountries: number;
  totalMovies: number;
  topCountry: CountryStat | null;
  currentFavorite: CountryStat | null;
  explorationPercentage: number;
}

export interface TimelineEntry {
  year: number;
  countries: CountryStat[];
}

export interface Recommendation {
  iso: string;
  name: string;
  flag: string;
  tagline: string;
}

const ts = (d: string) => new Date(d).getTime();

export function useMapData() {
  const { data: reviews = [], isLoading: reviewsLoading } = useMyReviews();

  // One representative entry per movie (latest watch), so rewatches don't inflate counts.
  const uniqueMovies = useMemo(() => {
    const map = new Map<number, MovieLogEntry>();
    for (const r of reviews) {
      const existing = map.get(r.movieId);
      if (!existing || ts(r.watchedDate) > ts(existing.watchedDate)) map.set(r.movieId, r);
    }
    return [...map.values()];
  }, [reviews]);

  const detailQueries = useQueries({
    queries: uniqueMovies.map((m) => ({
      queryKey: queryKeys.movieDetails(m.movieId),
      queryFn: () => fetchMovieDetails(m.movieId),
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60,
    })),
  });

  const detailsLoaded = detailQueries.filter((q) => q.data).length;
  const loading = reviewsLoading || detailQueries.some((q) => q.isLoading);

  const signature = `${uniqueMovies.length}:${detailsLoaded}`;

  return useMemo(() => {
    const byIso = new Map<string, CountryStat>();

    uniqueMovies.forEach((movie, i) => {
      const details = detailQueries[i]?.data;
      if (!details) return;
      const iso = details.production_countries?.[0]?.iso_3166_1;
      if (!iso) return;
      const geo = COUNTRY_GEO[iso];
      if (!geo) return; // country not on our map — skip

      let country = byIso.get(iso);
      if (!country) {
        country = {
          iso,
          name: geo.name,
          flag: isoToFlag(iso),
          lat: geo.lat,
          lon: geo.lon,
          continent: geo.continent,
          moviesWatched: 0,
          averageRating: 0,
          movies: [],
          firstWatchedDate: movie.watchedDate,
          lastWatchedDate: movie.watchedDate,
        };
        byIso.set(iso, country);
      }
      country.moviesWatched += 1;
      country.movies.push({
        movieId: movie.movieId,
        title: movie.movieTitle,
        posterPath: movie.posterPath,
        rating: movie.rating,
        watchedDate: movie.watchedDate,
      });
      if (ts(movie.watchedDate) > ts(country.lastWatchedDate)) country.lastWatchedDate = movie.watchedDate;
      if (ts(movie.watchedDate) < ts(country.firstWatchedDate)) country.firstWatchedDate = movie.watchedDate;
    });

    const countries = [...byIso.values()].map((c) => {
      const rated = c.movies.filter((m) => m.rating > 0);
      const averageRating = rated.length
        ? rated.reduce((s, m) => s + m.rating, 0) / rated.length
        : 0;
      const movies = [...c.movies].sort((a, b) => b.rating - a.rating);
      return { ...c, averageRating, movies };
    });

    const totalMovies = uniqueMovies.length;
    const totalCountries = countries.length;
    const topCountry =
      [...countries].sort((a, b) => b.moviesWatched - a.moviesWatched)[0] ?? null;
    const currentFavorite =
      [...countries].sort((a, b) => ts(b.lastWatchedDate) - ts(a.lastWatchedDate))[0] ?? null;
    const explorationPercentage = Math.round((totalCountries / PLOTTABLE_COUNTRY_COUNT) * 100);

    const stats: UserMapStats = {
      totalCountries,
      totalMovies,
      topCountry,
      currentFavorite,
      explorationPercentage,
    };

    // Timeline: group each country's *first* watch by year, ascending.
    const timelineMap = new Map<number, CountryStat[]>();
    [...countries]
      .sort((a, b) => ts(a.firstWatchedDate) - ts(b.firstWatchedDate))
      .forEach((c) => {
        const year = new Date(c.firstWatchedDate).getFullYear();
        const bucket = timelineMap.get(year);
        if (bucket) bucket.push(c);
        else timelineMap.set(year, [c]);
      });
    const timeline: TimelineEntry[] = [...timelineMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([year, cs]) => ({ year, countries: cs }));

    const explored = new Set(countries.map((c) => c.iso));
    const recommendations: Recommendation[] = NOTABLE_CINEMAS.filter((n) => !explored.has(n.iso))
      .slice(0, 6)
      .map((n) => ({
        iso: n.iso,
        name: COUNTRY_GEO[n.iso]?.name ?? n.iso,
        flag: isoToFlag(n.iso),
        tagline: n.tagline,
      }));

    const maxCount = countries.reduce((m, c) => Math.max(m, c.moviesWatched), 0);

    return { countries, stats, timeline, recommendations, maxCount, loading };
    // detailQueries is intentionally read via `signature` (loaded-count) rather
    // than listed, so we don't recompute on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueMovies, signature, loading]);
}
