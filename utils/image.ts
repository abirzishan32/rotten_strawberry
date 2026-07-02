const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export function posterUrl(path: string | null, size: PosterSize = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: BackdropSize = 'w1280'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function profileUrl(path: string | null, size: ProfileSize = 'w185'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
