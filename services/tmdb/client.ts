import Constants from 'expo-constants';
import axios from 'axios';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApiKey = Constants.expoConfig?.extra?.tmdbApiKey as string | undefined;

if (!tmdbApiKey && __DEV__) {
  console.warn(
    '[tmdb] TMDB_API_KEY is not set. Add it to your .env file and restart the dev server.'
  );
}

export const tmdbClient = axios.create({
  baseURL: TMDB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${tmdbApiKey ?? ''}`,
    accept: 'application/json',
  },
  params: {
    language: 'en-US',
  },
});

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.status_message ?? error?.message ?? 'Unknown TMDB API error';
    return Promise.reject(new Error(message));
  }
);
