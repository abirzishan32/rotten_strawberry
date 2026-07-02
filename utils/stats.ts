import { BROWSE_GENRES } from '@/constants/genres';
import type { MovieLogEntry } from '@/types';

const GENRE_NAME_BY_ID = new Map(BROWSE_GENRES.map((g) => [g.id, g.name]));

export interface DiaryStats {
  totalWatched: number;
  totalReviews: number;
  averageRating: number;
  topGenres: string[];
}

export function computeDiaryStats(entries: MovieLogEntry[]): DiaryStats {
  const watched = entries.filter((entry) => entry.watched);
  const reviewed = entries.filter((entry) => entry.reviewText.trim().length > 0);
  const ratedEntries = entries.filter((entry) => entry.rating > 0);

  const averageRating = ratedEntries.length
    ? ratedEntries.reduce((sum, entry) => sum + entry.rating, 0) / ratedEntries.length
    : 0;

  const genreCounts = new Map<number, number>();
  for (const entry of entries) {
    for (const genreId of entry.genreIds) {
      genreCounts.set(genreId, (genreCounts.get(genreId) ?? 0) + 1);
    }
  }

  const topGenres = [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => GENRE_NAME_BY_ID.get(id))
    .filter((name): name is string => Boolean(name));

  return {
    totalWatched: watched.length,
    totalReviews: reviewed.length,
    averageRating,
    topGenres,
  };
}
