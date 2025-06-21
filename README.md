# SoulCare Android App

This project contains all the necessary files and configurations to build the SoulCare Android APK from the web application.

## Prerequisites

- Android Studio
- Java Development Kit (JDK) 11 or newer
- Node.js and NPM

## Project Structure

- `/android` - Android project files
- `/client` - Web application source code
- `/server` - Backend server code
- `/capacitor.config.ts` - Capacitor configuration
- `/app_icon.svg` - Source SVG for the app icon

## Building the APK

### Option 1: Using Android Studio

1. Open the Android project in Android Studio:
   ```
   File > Open > Select the "android" folder in this project
   ```

2. Sync the project with Gradle:
   ```
   File > Sync Project with Gradle Files
   ```

3. Build the APK:
   ```
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

4. The APK will be generated in:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Option 2: Using Command Line

1. Build the web application:
   ```
   npm run build
   ```

2. Copy web assets to Android:
   ```
   npx cap copy android
   ```

3. Build the APK:
   ```
   cd android
   ./gradlew assembleRelease
   ```

4. The APK will be in:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## Keystore Information

The application is signed with a keystore located at:
```
android/app/keystore/soulcare.keystore
```

Keystore credentials:
- Keystore password: soulcare123
- Key alias: soulcare
- Key password: soulcare123

## App Configuration

The app is configured with:
- App ID: io.soulcare.app
- App Name: SoulCare
- Target SDK: Latest Android SDK
- Min SDK: Android 5.0 (API 21)

## Modifying the App

1. To change the app icon, replace the existing icon files in the Android project or regenerate them from the SVG source.
2. To modify the app theme colors, edit the color values in `android/app/src/main/res/values/colors.xml`.
3. To change app settings, modify the `capacitor.config.ts` file and run `npx cap copy android` again.

## Troubleshooting

If you encounter any issues:
1. Make sure all dependencies are installed with `npm install`
2. Ensure the Android SDK and JDK are properly set up
3. Check that the keystore file exists and has the correct permissions
4. Verify that the web build completed successfully before copying to Android