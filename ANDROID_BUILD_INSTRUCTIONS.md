# SoulCare Android App Build Instructions

## Overview
This document provides instructions on how to build the SoulCare Android APK from the provided Android Studio project.

## Prerequisites
- Android Studio (latest version recommended)
- JDK 17 ONLY (application requires exactly JDK 17, NOT compatible with JDK 21)
- Android SDK installed via Android Studio (API Level 34)

## Steps to Build the APK

### 1. Extract the Android Project
- Download the `SoulCare-Android-Project.zip` file
- Extract the contents to a location on your computer

### 2. Open the Project in Android Studio
- Launch Android Studio
- Select "Open an Existing Project"
- Navigate to the extracted folder and select the `android` directory
- Wait for Android Studio to sync the project and download any necessary dependencies
- If prompted to update Gradle, click "Cancel" and keep the existing version

### 3. Configure SDK Location (if needed)
- If Android Studio doesn't find your SDK, go to File > Project Structure > SDK Location
- Set the Android SDK location to where your Android SDK is installed
- The project is already configured with a sample local.properties file, but you may need to update it

### 4. Signing Configuration
- The project is already configured to use the keystore file at `android/app/keystore/soulcare.keystore`
- The signing information is hardcoded in the build.gradle file:
  - Store file: `keystore/soulcare.keystore`
  - Store password: `password`
  - Key alias: `soulcare`
  - Key password: `password`

### 4. Build the APK
- In Android Studio, select `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- Wait for the build process to complete
- Android Studio will display a notification when the APK is built successfully

### 5. Locate the APK
- The APK file can be found at: `android/app/build/outputs/apk/release/app-release.apk`
- You can also click on the "locate" link in the notification after the build completes

### 6. Install on Android Device
- Transfer the APK to your Android device
- On your Android device, navigate to the APK file and tap on it to install
- You may need to enable "Install from Unknown Sources" in your device settings

## Troubleshooting

### Common Issues

1. **App Showing Replit Development Environment**
   - This happens if the app is trying to use the development server instead of the bundled app
   - We've fixed this by using environment-aware configuration in capacitor.config.ts
   - The server configuration is automatically excluded in production builds
   - We've also added `loggingBehavior: 'production'` to ensure it uses bundled assets
   - The package-android.sh script now automatically fixes asset paths in the built index.html from absolute paths (/assets/) to relative paths (./assets/) and removes the Replit development banner
   - We've enhanced MainActivity.java with a custom WebViewClient that blocks requests to Replit domains
   - Always run the package-android.sh script to correctly prepare the app for Android building
   - If you're getting a blank screen or a 404 error in the app, check the `dist/public` folder to ensure the web assets were properly built

2. **Gradle and JDK Configuration Issues**
   - Ensure you have Android SDK Platform 34 installed via SDK Manager
   - Try running `File > Sync Project with Gradle Files`
   - This project requires:
     - Gradle 8.2.1
     - Android Gradle Plugin 8.1.2
     - JDK 17 ONLY (will NOT work with JDK 21)
   - JDK Configuration:
     - Go to File > Settings > Build, Execution, Deployment > Build Tools > Gradle
     - Set "Gradle JDK" to "jbr-17" or a JDK 17 installation
     - If using Android Studio with JDK 21 built in:
       - Download JDK 17 from Oracle or Amazon Corretto 
       - Point Android Studio to this JDK 17 installation
       - If you keep seeing jlink.exe errors, this is because you're not using JDK 17
     - Restart Android Studio after changing JDK settings
   - Gradle Configuration:
     - Edit `android/gradle/wrapper/gradle-wrapper.properties` to use:
       `distributionUrl=https\://services.gradle.org/distributions/gradle-8.2.1-all.zip`
     - Edit `android/build.gradle` to use Android Gradle Plugin 8.1.2:
       `classpath 'com.android.tools.build:gradle:8.1.2'`

3. **Duplicate Resource Issues**
   - Our packaging script automatically fixes ALL common resource conflicts:
     - **Splash screen**: Renames splash.xml to splash_background.xml and updates references
     - **Launcher icons**: Renames drawable/ic_launcher_background.xml to ic_launcher_background_vector.xml
     - **Colors**: Consolidates ALL color definitions into a single colors.xml file, removing duplicates
     - **Strings**: Consolidates ALL string resources into a single strings.xml file, removing duplicates
     - **Drawables**: Automatically renames duplicate drawable XML files across different directories
   - These fixes are applied automatically during packaging, so you shouldn't see resource conflicts
   - If you somehow still encounter "Duplicate resources" errors when building in Android Studio:
     1. Try running our package-android.sh script again (it's designed to fix all duplications)
     2. Look at the error details to identify which specific files are in conflict
     3. For color/string resources: The script should have consolidated them already
     4. For drawable resources: The script should have renamed conflicting files
     5. Manual fixes (rarely needed):
        - Rename one of the conflicting resources (and update all references)
        - Delete one of the duplicates if it's not needed
        - Move multiple resource definitions to a single file

4. **SDK Location Issues**
   - If Android Studio cannot find your SDK, update the local.properties file with your SDK path
   - On Windows, use double backslashes: `sdk.dir=C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - On macOS/Linux: `sdk.dir=/Users/YourUsername/Library/Android/sdk` or `/home/YourUsername/Android/Sdk`

5. **Signing Configuration Issues**
   - If you get errors about signing configuration, check that the keystore file is in `android/app/keystore/soulcare.keystore`
   - You can create a new keystore if needed using Android Studio: Build > Generate Signed Bundle/APK

## Note
This project uses Capacitor to wrap a web application in a native Android container. The web assets are located in `android/app/src/main/assets/public/`.
