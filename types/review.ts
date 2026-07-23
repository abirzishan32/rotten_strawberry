export type PrivacyLevel = 'public' | 'friends' | 'private';

export interface MovieLogEntry {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  genreIds: number[];
  /** The "Movie" metric (overall). 0.5–5, or 0 when unset. */
  rating: number;
  ratingEnding: number;
  ratingRewatchability: number;
  ratingPacing: number;
  reviewText: string;
  watched: boolean;
  watchedDate: string;
  liked: boolean;
  containsSpoilers: boolean;
  tags: string[];
  privacy: PrivacyLevel;
  createdAt: string;
}

/** The four rating metrics a review captures. `rating` is the overall "Movie" score. */
export const REVIEW_METRICS = [
  { key: 'rating', label: 'Movie' },
  { key: 'ratingEnding', label: 'Ending' },
  { key: 'ratingRewatchability', label: 'Rewatchability' },
  { key: 'ratingPacing', label: 'Pacing' },
] as const;

export type ReviewMetricKey = (typeof REVIEW_METRICS)[number]['key'];
