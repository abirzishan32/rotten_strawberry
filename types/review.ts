export type PrivacyLevel = 'public' | 'friends' | 'private';

export interface MovieLogEntry {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  genreIds: number[];
  rating: number;
  reviewText: string;
  watched: boolean;
  watchedDate: string;
  liked: boolean;
  containsSpoilers: boolean;
  tags: string[];
  privacy: PrivacyLevel;
  createdAt: string;
}
