import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'animated-speech',
  slug: 'animated-speech',
  version: '1.0.0',
  scheme: 'animated-speech',
  platforms: ['ios', 'android'],
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router', 'expo-web-browser'],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.animated-speech',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.anonymous.animatedspeech',
  },
  extra: {
    azureKey: process.env.AZURE_SPEECH_KEY ?? '',
    azureRegion: process.env.AZURE_REGION ?? '',
  },
});
