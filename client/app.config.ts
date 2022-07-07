/* eslint-disable max-len */
import { ExpoConfig, ConfigContext } from '@expo/config';

const localhost = process.env.REAL_DEVICE_LOCAl_IP
  ? `http://${process.env.REAL_DEVICE_LOCAl_IP}:8000/`
  : 'http://localhost:8000/';

const firebaseLocalConfigs = {
  apiKey: 'AIzaSyDUiBL6DE0cgKFOtUZB__f_t7q8T1egcZs',
  authDomain: 'yenbek-4d20b.firebaseapp.com',
  projectId: 'yenbek-4d20b',
  storageBucket: 'yenbek-4d20b.appspot.com',
  messagingSenderId: '209199524410',
  appId: '1:209199524410:web:5b78822b33bf84b7e36303',
  measurementId: 'G-LFQGYHKD6Q',
};

// local environment configs
const Config = {
  apiUrl: localhost,
  enableHiddenFeatures: true,
  sentryAuthToken:
    'c1ca52ce77aa4840b4e36b2adbf7aa1380e1f53fa33d4549a6e5ae6d84282049',
  sentryDsn:
    'https://bada9997e9124588938f6927989204f8@o1136304.ingest.sentry.io/6188333',
  env: 'local',
  firebaseConfig: JSON.stringify(firebaseLocalConfigs),
  adUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/4411468910',
};

if (process.env.APP_ENV === 'production') {
  Config.apiUrl = process.env.API_URL_PRODUCTION ?? '';
  Config.enableHiddenFeatures = false;
  Config.sentryAuthToken = process.env.SENTRY_AUTH_TOKEN ?? '';
  Config.sentryDsn = process.env.SENTRY_DSN ?? '';
  Config.env = 'production';
  Config.firebaseConfig = process.env.FIREBASE_CONFIG_PRODUCTION ?? '';
  Config.adUnitId = process.env.AD_UNIT_ID ?? '';
  Config.interstitialAdUnitId = process.env.INTERSTITIAL_AD_UNIT_ID ?? '';
} else if (process.env.APP_ENV === 'staging') {
  const firebaseStagingConfigs = {
    apiKey: 'AIzaSyC3z6w7d3yt_Y6oe17o2kI7bngnRQ2HKWo',
    authDomain: 'typingpro-staging.firebaseapp.com',
    projectId: 'typingpro-staging',
    storageBucket: 'typingpro-staging.appspot.com',
    messagingSenderId: '291931910181',
    appId: '1:291931910181:web:5c385102064a5f6c884fcc',
    measurementId: 'G-8RC3K7HDE2',
  };
  Config.apiUrl = process.env.API_URL_STAGING ?? '';
  Config.enableHiddenFeatures = true;
  Config.sentryAuthToken = process.env.SENTRY_AUTH_TOKEN ?? '';
  Config.sentryDsn = process.env.SENTRY_DSN ?? '';
  Config.env = 'staging';
  // Config.firebaseConfig = process.env.FIREBASE_CONFIG_STAGING ?? '';
  Config.firebaseConfig = JSON.stringify(firebaseStagingConfigs);
  Config.adUnitId = process.env.AD_UNIT_ID ?? '';
  Config.interstitialAdUnitId = process.env.INTERSTITIAL_AD_UNIT_ID ?? '';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TypingPro',
  slug: 'typingpro',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/typingpro.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash2.png',
    resizeMode: 'cover',
  },
  extra: {
    ...Config,
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.yenbek.typingpro',
    supportsTablet: true,
  },
  android: {
    package: 'com.yenbek.typingpro',
    // googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/images/android-icon.png',
      backgroundColor: '#352D5F',
    },
    versionCode: 1,
  },
  web: {
    // config: {
    //   // TODO: not working, can't be JSON parsed
    //   // firebase: JSON.parse(Config.firebaseConfig),
    // },
    favicon: './assets/images/typingpro.png',
  },
  plugins: [
    'sentry-expo',
    [
      'expo-ads-admob',
      {
        userTrackingPermission:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
  ],
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'yenbek',
          project: 'yenbek',
          authToken: Config.sentryAuthToken,
          setCommits: true,
        },
      },
    ],
  },
});
