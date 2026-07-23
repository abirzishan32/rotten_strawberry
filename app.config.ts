import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'my-app',
  slug: 'my-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    '@react-native-community/datetimepicker',
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow $(PRODUCT_NAME) to access your photos so you can set a profile picture.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    // Disabled: still experimental for React Native, and its automatic
    // memoization mishandles ref chains that go through nested
    // forwardRef + useImperativeHandle (e.g. the filter bottom sheet's
    // SearchFilterSheet -> AppBottomSheet -> BottomSheetModal ref
    // forwarding), which broke calling sheetRef.current.present().
    reactCompiler: false,
  },
  extra: {
    // Loaded server-side from .env (TMDB_API_KEY) so the raw key never has
    // to be prefixed with EXPO_PUBLIC_ / bundled as literal source text.
    tmdbApiKey: process.env.TMDB_API_KEY,
    // Supabase project URL + anon key. The anon key is public-safe (guarded
    // by Row Level Security); the service_role key is intentionally NOT here.
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
};

export default config;
