import type { CapacitorConfig } from '@capacitor/cli';

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

const config: CapacitorConfig = {
  appId: 'io.soulcare.app',
  appName: 'SoulCare',
  webDir: 'dist/public',
  // Use server config only in development mode
  // Only include server configuration for development
  // For production builds, this section will be omitted
  ...(!isProduction && {
    server: {
      androidScheme: 'https',
      cleartext: true,
      allowNavigation: [
        'localhost',
        '*.replit.app'
      ]
    }
  }),
  android: {
    buildOptions: {
      keystorePath: 'android/app/keystore/soulcare.keystore',
      keystoreAlias: 'soulcare',
      keystorePassword: 'password',
      keystoreAliasPassword: 'password'
    }
  },
  // Force using bundled web content (important for production builds)
  loggingBehavior: 'production',
  // Other recommended production settings
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false
    }
  }
};

export default config;
