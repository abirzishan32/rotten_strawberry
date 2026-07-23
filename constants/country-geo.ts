/**
 * Approximate country centroids + continent, keyed by ISO 3166-1 alpha-2 (the
 * same codes TMDB returns in `production_countries[].iso_3166_1`). Used to place
 * glowing nodes on the equirectangular world map. Coordinates are rough centroids
 * — good enough for a stylised map, not survey-grade.
 */
export type Continent =
  | 'Asia'
  | 'Europe'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface CountryGeo {
  name: string;
  lat: number;
  lon: number;
  continent: Continent;
}

export const COUNTRY_GEO: Record<string, CountryGeo> = {
  // North America
  US: { name: 'United States', lat: 39, lon: -98, continent: 'North America' },
  CA: { name: 'Canada', lat: 56, lon: -106, continent: 'North America' },
  MX: { name: 'Mexico', lat: 23, lon: -102, continent: 'North America' },
  CU: { name: 'Cuba', lat: 22, lon: -80, continent: 'North America' },
  GT: { name: 'Guatemala', lat: 15.7, lon: -90.2, continent: 'North America' },
  CR: { name: 'Costa Rica', lat: 10, lon: -84, continent: 'North America' },
  PA: { name: 'Panama', lat: 9, lon: -80, continent: 'North America' },
  DO: { name: 'Dominican Republic', lat: 19, lon: -70.7, continent: 'North America' },
  JM: { name: 'Jamaica', lat: 18.1, lon: -77.3, continent: 'North America' },
  HT: { name: 'Haiti', lat: 19, lon: -72.3, continent: 'North America' },
  // South America
  BR: { name: 'Brazil', lat: -10, lon: -55, continent: 'South America' },
  AR: { name: 'Argentina', lat: -34, lon: -64, continent: 'South America' },
  CL: { name: 'Chile', lat: -35, lon: -71, continent: 'South America' },
  CO: { name: 'Colombia', lat: 4, lon: -73, continent: 'South America' },
  PE: { name: 'Peru', lat: -10, lon: -76, continent: 'South America' },
  VE: { name: 'Venezuela', lat: 7, lon: -66, continent: 'South America' },
  UY: { name: 'Uruguay', lat: -33, lon: -56, continent: 'South America' },
  BO: { name: 'Bolivia', lat: -17, lon: -65, continent: 'South America' },
  PY: { name: 'Paraguay', lat: -23, lon: -58, continent: 'South America' },
  EC: { name: 'Ecuador', lat: -1.8, lon: -78, continent: 'South America' },
  // Europe
  GB: { name: 'United Kingdom', lat: 54, lon: -2, continent: 'Europe' },
  FR: { name: 'France', lat: 46, lon: 2, continent: 'Europe' },
  DE: { name: 'Germany', lat: 51, lon: 10, continent: 'Europe' },
  IT: { name: 'Italy', lat: 42, lon: 12, continent: 'Europe' },
  ES: { name: 'Spain', lat: 40, lon: -4, continent: 'Europe' },
  PT: { name: 'Portugal', lat: 39.5, lon: -8, continent: 'Europe' },
  IE: { name: 'Ireland', lat: 53, lon: -8, continent: 'Europe' },
  NL: { name: 'Netherlands', lat: 52, lon: 5.7, continent: 'Europe' },
  BE: { name: 'Belgium', lat: 50.6, lon: 4.6, continent: 'Europe' },
  CH: { name: 'Switzerland', lat: 47, lon: 8, continent: 'Europe' },
  AT: { name: 'Austria', lat: 47.5, lon: 14, continent: 'Europe' },
  SE: { name: 'Sweden', lat: 62, lon: 15, continent: 'Europe' },
  NO: { name: 'Norway', lat: 61, lon: 9, continent: 'Europe' },
  DK: { name: 'Denmark', lat: 56, lon: 10, continent: 'Europe' },
  FI: { name: 'Finland', lat: 64, lon: 26, continent: 'Europe' },
  IS: { name: 'Iceland', lat: 65, lon: -18, continent: 'Europe' },
  PL: { name: 'Poland', lat: 52, lon: 19, continent: 'Europe' },
  CZ: { name: 'Czech Republic', lat: 49.8, lon: 15.5, continent: 'Europe' },
  SK: { name: 'Slovakia', lat: 48.7, lon: 19.7, continent: 'Europe' },
  HU: { name: 'Hungary', lat: 47, lon: 20, continent: 'Europe' },
  RO: { name: 'Romania', lat: 46, lon: 25, continent: 'Europe' },
  BG: { name: 'Bulgaria', lat: 42.7, lon: 25.5, continent: 'Europe' },
  GR: { name: 'Greece', lat: 39, lon: 22, continent: 'Europe' },
  HR: { name: 'Croatia', lat: 45.1, lon: 15.2, continent: 'Europe' },
  RS: { name: 'Serbia', lat: 44, lon: 21, continent: 'Europe' },
  BA: { name: 'Bosnia and Herzegovina', lat: 44, lon: 18, continent: 'Europe' },
  SI: { name: 'Slovenia', lat: 46, lon: 15, continent: 'Europe' },
  AL: { name: 'Albania', lat: 41, lon: 20, continent: 'Europe' },
  MK: { name: 'North Macedonia', lat: 41.6, lon: 21.7, continent: 'Europe' },
  RU: { name: 'Russia', lat: 61, lon: 90, continent: 'Europe' },
  UA: { name: 'Ukraine', lat: 49, lon: 32, continent: 'Europe' },
  BY: { name: 'Belarus', lat: 53, lon: 28, continent: 'Europe' },
  LT: { name: 'Lithuania', lat: 55, lon: 24, continent: 'Europe' },
  LV: { name: 'Latvia', lat: 57, lon: 25, continent: 'Europe' },
  EE: { name: 'Estonia', lat: 59, lon: 26, continent: 'Europe' },
  LU: { name: 'Luxembourg', lat: 49.8, lon: 6.1, continent: 'Europe' },
  MT: { name: 'Malta', lat: 35.9, lon: 14.4, continent: 'Europe' },
  CY: { name: 'Cyprus', lat: 35, lon: 33, continent: 'Europe' },
  // Asia
  JP: { name: 'Japan', lat: 36, lon: 138, continent: 'Asia' },
  KR: { name: 'South Korea', lat: 36, lon: 128, continent: 'Asia' },
  KP: { name: 'North Korea', lat: 40, lon: 127, continent: 'Asia' },
  CN: { name: 'China', lat: 35, lon: 105, continent: 'Asia' },
  HK: { name: 'Hong Kong', lat: 22.3, lon: 114.2, continent: 'Asia' },
  TW: { name: 'Taiwan', lat: 23.7, lon: 121, continent: 'Asia' },
  IN: { name: 'India', lat: 22, lon: 79, continent: 'Asia' },
  TH: { name: 'Thailand', lat: 15, lon: 101, continent: 'Asia' },
  VN: { name: 'Vietnam', lat: 16, lon: 108, continent: 'Asia' },
  ID: { name: 'Indonesia', lat: -2, lon: 118, continent: 'Asia' },
  PH: { name: 'Philippines', lat: 13, lon: 122, continent: 'Asia' },
  MY: { name: 'Malaysia', lat: 4, lon: 102, continent: 'Asia' },
  SG: { name: 'Singapore', lat: 1.35, lon: 103.8, continent: 'Asia' },
  BD: { name: 'Bangladesh', lat: 24, lon: 90, continent: 'Asia' },
  PK: { name: 'Pakistan', lat: 30, lon: 70, continent: 'Asia' },
  LK: { name: 'Sri Lanka', lat: 7, lon: 81, continent: 'Asia' },
  NP: { name: 'Nepal', lat: 28, lon: 84, continent: 'Asia' },
  MM: { name: 'Myanmar', lat: 21, lon: 96, continent: 'Asia' },
  KH: { name: 'Cambodia', lat: 12, lon: 105, continent: 'Asia' },
  MN: { name: 'Mongolia', lat: 46, lon: 105, continent: 'Asia' },
  KZ: { name: 'Kazakhstan', lat: 48, lon: 68, continent: 'Asia' },
  GE: { name: 'Georgia', lat: 42, lon: 43, continent: 'Asia' },
  AM: { name: 'Armenia', lat: 40, lon: 45, continent: 'Asia' },
  IR: { name: 'Iran', lat: 32, lon: 53, continent: 'Asia' },
  TR: { name: 'Turkey', lat: 39, lon: 35, continent: 'Asia' },
  IL: { name: 'Israel', lat: 31, lon: 35, continent: 'Asia' },
  LB: { name: 'Lebanon', lat: 33.8, lon: 35.8, continent: 'Asia' },
  JO: { name: 'Jordan', lat: 31, lon: 36, continent: 'Asia' },
  SA: { name: 'Saudi Arabia', lat: 24, lon: 45, continent: 'Asia' },
  AE: { name: 'United Arab Emirates', lat: 24, lon: 54, continent: 'Asia' },
  QA: { name: 'Qatar', lat: 25.3, lon: 51.2, continent: 'Asia' },
  IQ: { name: 'Iraq', lat: 33, lon: 44, continent: 'Asia' },
  SY: { name: 'Syria', lat: 35, lon: 38, continent: 'Asia' },
  // Africa
  ZA: { name: 'South Africa', lat: -30, lon: 25, continent: 'Africa' },
  NG: { name: 'Nigeria', lat: 10, lon: 8, continent: 'Africa' },
  EG: { name: 'Egypt', lat: 27, lon: 30, continent: 'Africa' },
  MA: { name: 'Morocco', lat: 32, lon: -6, continent: 'Africa' },
  DZ: { name: 'Algeria', lat: 28, lon: 3, continent: 'Africa' },
  TN: { name: 'Tunisia', lat: 34, lon: 9, continent: 'Africa' },
  KE: { name: 'Kenya', lat: 0, lon: 38, continent: 'Africa' },
  ET: { name: 'Ethiopia', lat: 8, lon: 40, continent: 'Africa' },
  GH: { name: 'Ghana', lat: 8, lon: -1, continent: 'Africa' },
  SN: { name: 'Senegal', lat: 14, lon: -14, continent: 'Africa' },
  ML: { name: 'Mali', lat: 17, lon: -4, continent: 'Africa' },
  CI: { name: 'Ivory Coast', lat: 8, lon: -5.5, continent: 'Africa' },
  CM: { name: 'Cameroon', lat: 6, lon: 12, continent: 'Africa' },
  UG: { name: 'Uganda', lat: 1.3, lon: 32.3, continent: 'Africa' },
  TZ: { name: 'Tanzania', lat: -6, lon: 35, continent: 'Africa' },
  ZW: { name: 'Zimbabwe', lat: -19, lon: 29, continent: 'Africa' },
  AO: { name: 'Angola', lat: -12, lon: 18, continent: 'Africa' },
  MZ: { name: 'Mozambique', lat: -18, lon: 35, continent: 'Africa' },
  // Oceania
  AU: { name: 'Australia', lat: -25, lon: 134, continent: 'Oceania' },
  NZ: { name: 'New Zealand', lat: -42, lon: 174, continent: 'Oceania' },
  FJ: { name: 'Fiji', lat: -17.7, lon: 178, continent: 'Oceania' },
};

/** Convert an ISO 3166-1 alpha-2 code to its flag emoji via regional indicators. */
export function isoToFlag(iso: string): string {
  if (!iso || iso.length !== 2) return '🏳️';
  const codePoints = iso
    .toUpperCase()
    .split('')
    .map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

/** Curated "notable national cinemas" used by the Discovery / recommendations section. */
export const NOTABLE_CINEMAS: { iso: string; tagline: string }[] = [
  { iso: 'IR', tagline: 'Iranian Cinema' },
  { iso: 'DK', tagline: 'Danish Cinema' },
  { iso: 'BR', tagline: 'Brazilian Cinema' },
  { iso: 'IN', tagline: 'Indian Cinema' },
  { iso: 'IT', tagline: 'Italian Cinema' },
  { iso: 'SE', tagline: 'Swedish Cinema' },
  { iso: 'JP', tagline: 'Japanese Cinema' },
  { iso: 'KR', tagline: 'Korean Cinema' },
  { iso: 'FR', tagline: 'French New Wave' },
  { iso: 'HK', tagline: 'Hong Kong Action' },
  { iso: 'DE', tagline: 'German Cinema' },
  { iso: 'AR', tagline: 'Argentine Cinema' },
  { iso: 'TW', tagline: 'Taiwanese Cinema' },
  { iso: 'PL', tagline: 'Polish Cinema' },
  { iso: 'RU', tagline: 'Russian Cinema' },
  { iso: 'MX', tagline: 'Mexican Cinema' },
];

/** Total countries we can plot — used for the exploration-percentage denominator. */
export const PLOTTABLE_COUNTRY_COUNT = Object.keys(COUNTRY_GEO).length;
