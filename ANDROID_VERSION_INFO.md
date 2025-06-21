# SoulCare Android App Version Information

## Core Framework Versions

- **Capacitor**: 7.2.0
- **React**: Using latest from the package.json
- **Android Compile SDK**: 34
- **Android Target SDK**: 34
- **Android Min SDK**: 23

## Build Tool Versions

- **Gradle**: 8.2.1 (Updated from 8.0.0/8.0.2)
- **Android Gradle Plugin**: 8.1.2 (Updated from 8.0.2)
- **JDK Compatibility**: REQUIRES JDK 17 ONLY

## Android Dependencies

- **AndroidX Activity**: 1.8.1
- **AndroidX AppCompat**: 1.6.1
- **AndroidX Core**: 1.12.0
- **Core Splash Screen**: 1.0.1
- **AndroidX WebKit**: 1.8.0

## Custom Implementation Details

### 1. Fixed WebView Loading

The application has been configured with a custom `MainActivity.java` implementation that:

- Forces the WebView to load only from local assets
- Blocks all network connections to prevent loading from Replit
- Uses a custom WebViewClient to intercept and redirect all external URL requests
- Includes multiple cache clearing mechanisms
- Checks if the assets exist before attempting to load them

### 2. Asset Path Handling

The `package-android.sh` script automatically:

- Fixes the asset paths in the bundled index.html from absolute (/assets/) to relative (./assets/)
- Removes the Replit development banner script that was being included in production builds

### 3. Build Configuration

- Added a fallback index.html in the assets folder for reliable loading
- Updated Gradle and Android Gradle Plugin versions for compatibility with modern Android Studio
- Configured capacitor.config.ts to use production mode and avoid development server connections

### 4. Android Studio Compatibility

This configuration has been tested and should work with:

- Android Studio Giraffe (2022.3.1) or later
- Android SDK Platform 34
- Gradle 8.2.1
- JDK 17 (required, will not work with JDK 21)

## Troubleshooting Notes

1. If you encounter build failures related to Gradle versions, check:
   - The `android/gradle/wrapper/gradle-wrapper.properties` file contains a valid Gradle distribution URL
   - The Android Gradle Plugin version in `android/build.gradle` is compatible with your Gradle version

2. If the app still shows the Replit environment, check:
   - That the build is being done with `NODE_ENV=production`
   - That the compiled assets include the correct index.html with relative paths
   - That `MainActivity.java` is correctly configured to block external requests

3. If you face SDK or JDK compatibility issues:
   - Ensure your Android Studio has SDK Platform 34 installed
   - **JDK Compatibility**: This app REQUIRES JDK 17 ONLY and will NOT work with JDK 21
     - In Android Studio: File > Settings > Build, Execution, Deployment > Build Tools > Gradle
     - Set "Gradle JDK" to JDK 17 ("jbr-17" or a JDK 17 installation)
     - If you're using Android Studio Iguana or Jellyfish that comes with JDK 21:
       - Install JDK 17 separately
       - Configure Android Studio to use your separate JDK 17 installation
     - If you get errors about "jlink.exe" or "JdkImageTransform" or "system-modules":
       - This is likely because you're using JDK 21 instead of JDK 17
       - Download and install JDK 17 from Oracle or Amazon Corretto
       - Make sure Android Studio uses this JDK 17 for the project
       - Invalidate caches and restart (File > Invalidate Caches / Restart)