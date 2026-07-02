import type { SortOption } from '@/types';

export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'de', label: 'German' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Highest rated' },
  { value: 'release_date.desc', label: 'Newest' },
  { value: 'release_date.asc', label: 'Oldest' },
  { value: 'title.asc', label: 'Title A–Z' },
];

export const RATING_OPTIONS = [5, 6, 7, 8, 9] as const;

export const RUNTIME_OPTIONS: { label: string; min?: number; max?: number }[] = [
  { label: 'Under 90m', max: 90 },
  { label: '90–120m', min: 90, max: 120 },
  { label: '120–150m', min: 120, max: 150 },
  { label: '150m+', min: 150 },
];

export const YEAR_OPTIONS: number[] = Array.from({ length: 20 }, (_, i) =>
  new Date().getFullYear() - i
);
