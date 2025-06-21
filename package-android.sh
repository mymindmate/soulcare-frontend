#!/bin/bash

echo "===== Packaging SoulCare Android Project ====="

# Step 1: Build the web application in production mode
echo "Building web application in production mode..."
export NODE_ENV=production
npm run build

# Step 1.5: Fix the paths in index.html (change /assets/ to ./assets/)
echo "Fixing asset paths in index.html..."
INDEX_FILE="dist/public/index.html"
sed -i 's|src="/assets/|src="./assets/|g' "$INDEX_FILE"
sed -i 's|href="/assets/|href="./assets/|g' "$INDEX_FILE"

# Step 1.6: Remove Replit dev banner script
echo "Removing Replit dev banner script..."
sed -i '/replit-dev-banner/d' "$INDEX_FILE"

# Step 2: Force production mode for Capacitor sync
echo "Configuring Capacitor for production mode..."
export NODE_ENV=production

# Step 3: Copy web assets to Android project with full sync
echo "Syncing web assets to Android..."
npx cap sync android

# Step 3.5: Copy the fallback index.html to ensure we have a backup entry point
echo "Ensuring fallback index.html is in place..."
cp -f android/app/src/main/assets/index.html android/app/src/main/assets/index.html.backup 2>/dev/null || :
cp -f "$INDEX_FILE" android/app/src/main/assets/index.html

# Step 4: Make sure the keystore directory exists
echo "Ensuring keystore directory exists..."
mkdir -p android/app/keystore

# Step 5: Fix splash screen and other duplicate resources
echo "Fixing resource conflicts..."
# Remove any duplicate splash.png files
rm -f android/app/src/main/res/drawable/splash.png
rm -f android/app/src/main/res/drawable-*-*/splash.png

# Ensure the splash_background.xml is correctly named
if [ -f android/app/src/main/res/drawable/splash.xml ] && [ ! -f android/app/src/main/res/drawable/splash_background.xml ]; then
  mv android/app/src/main/res/drawable/splash.xml android/app/src/main/res/drawable/splash_background.xml
  
  # Update styles.xml reference if needed
  sed -i 's|@drawable/splash"|@drawable/splash_background"|g' android/app/src/main/res/values/styles.xml
fi

# Fix duplicate resources in colors.xml files
echo "Fixing colors.xml duplicates..."

# Create consolidated colors list
COLORS_TEMP=$(mktemp)
echo '<?xml version="1.0" encoding="utf-8"?>' > "$COLORS_TEMP"
echo '<resources>' >> "$COLORS_TEMP"

# Find all colors.xml files
find android -name "colors.xml" -type f | while read colors_file; do
  echo "Processing $colors_file"
  grep '<color name=' "$colors_file" | sort | uniq >> "$COLORS_TEMP.raw"
done

# Also add colors from ic_launcher_background.xml if it exists
for ic_file in $(find android -name "ic_launcher_background.xml" -type f); do
  echo "Processing $ic_file for colors"
  grep '<color name=' "$ic_file" | sort | uniq >> "$COLORS_TEMP.raw"
done

# Sort and make unique all color definitions
sort "$COLORS_TEMP.raw" | uniq >> "$COLORS_TEMP.sorted"

# Parse each color definition and add to new file, removing duplicates
cat "$COLORS_TEMP.sorted" | while read color_line; do
  if [[ "$color_line" =~ \<color\ name=\"([^\"]+)\" ]]; then
    name="${BASH_REMATCH[1]}"
    # If this color name wasn't added before, add it
    if ! grep -q "name=\"$name\"" "$COLORS_TEMP"; then
      echo "    $color_line" >> "$COLORS_TEMP"
    fi
  fi
done

echo '</resources>' >> "$COLORS_TEMP"

# Replace all colors.xml files with our consolidated file
find android -name "colors.xml" -type f | while read colors_file; do
  cp "$COLORS_TEMP" "$colors_file"
done

# Remove all ic_launcher_background.xml files in values directories
find android/app/src/main/res/values* -name "ic_launcher_background.xml" -type f -delete

# Clean up temp files
rm -f "$COLORS_TEMP" "$COLORS_TEMP.raw" "$COLORS_TEMP.sorted"

# Rename drawable/ic_launcher_background.xml to avoid conflict with the color resource
if [ -f android/app/src/main/res/drawable/ic_launcher_background.xml ]; then
  # Rename the file whether or not the values file exists (since we now consolidate it to colors.xml)
  mv android/app/src/main/res/drawable/ic_launcher_background.xml android/app/src/main/res/drawable/ic_launcher_background_vector.xml
  
  # Update any references
  find android -name "*.xml" -type f -exec sed -i 's|@drawable/ic_launcher_background"|@drawable/ic_launcher_background_vector"|g' {} \;
fi

# Fix duplicate string resources
echo "Fixing strings.xml duplicates..."
# Same approach as colors, but for strings
STRINGS_TEMP=$(mktemp)
echo '<?xml version="1.0" encoding="utf-8"?>' > "$STRINGS_TEMP"
echo '<resources>' >> "$STRINGS_TEMP"

# Find all strings.xml files
find android -name "strings.xml" -type f | while read strings_file; do
  echo "Processing $strings_file"
  grep '<string name=' "$strings_file" | sort | uniq >> "$STRINGS_TEMP.raw"
done

# Sort and make unique all string definitions
if [ -f "$STRINGS_TEMP.raw" ]; then
  sort "$STRINGS_TEMP.raw" | uniq > "$STRINGS_TEMP.sorted"
  
  # Parse each string definition and add to new file, removing duplicates
  cat "$STRINGS_TEMP.sorted" | while read string_line; do
    if [[ "$string_line" =~ \<string\ name=\"([^\"]+)\" ]]; then
      name="${BASH_REMATCH[1]}"
      # If this string name wasn't added before, add it
      if ! grep -q "name=\"$name\"" "$STRINGS_TEMP"; then
        echo "    $string_line" >> "$STRINGS_TEMP"
      fi
    fi
  done
fi

echo '</resources>' >> "$STRINGS_TEMP"

# Replace all strings.xml files with our consolidated file
find android -name "strings.xml" -type f | while read strings_file; do
  cp "$STRINGS_TEMP" "$strings_file"
done

# Clean up temp files
rm -f "$STRINGS_TEMP" "$STRINGS_TEMP.raw" "$STRINGS_TEMP.sorted"

# Fix any other duplicate drawable resources
echo "Fixing other resource duplicates..."

# Ensure drawable resource names are unique (not just files but their contents)
for res_dir in $(find android -path "*/res/drawable*" -type d); do
  echo "Checking drawable resources in $res_dir"

  # Find XML files with the same name in different drawable directories
  for xml_file in $(find "$res_dir" -name "*.xml" | xargs basename | sort | uniq -d); do
    echo "Found potentially duplicate drawable: $xml_file"
    # Find all instances of this XML file across drawable directories
    instances=($(find android -path "*/res/drawable*" -name "$xml_file"))
    
    # Keep the first one, rename others
    for ((i=1; i<${#instances[@]}; i++)); do
      # Get the filename without extension
      base_name=$(basename "${instances[$i]}" .xml)
      new_name="${base_name}_${i}.xml"
      echo "Renaming duplicate ${instances[$i]} to $new_name"
      
      # Get the directory of the file
      dir_name=$(dirname "${instances[$i]}")
      mv "${instances[$i]}" "$dir_name/$new_name"
      
      # Update any references to this drawable
      find android -name "*.xml" -type f -exec sed -i "s|@drawable/$base_name\"|@drawable/${base_name}_${i}\"|g" {} \;
    done
  done
done

# Step 6: Ensure JDK 17 compatibility
echo "Applying JDK 17 compatibility settings..."

# Ensure we have the proper JDK 17 settings
if grep -q "add-exports=java.base/sun.nio.ch=ALL-UNNAMED" android/gradle.properties; then
  # Remove any JDK 21 flags if they exist
  sed -i 's/org.gradle.jvmargs=.*$/org.gradle.jvmargs=-Xmx1536m/' android/gradle.properties
fi

# Remove JDK 21 compatibility properties if they exist and add JDK 17 settings
sed -i '/Enable compatibility with JDK 21/d' android/gradle.properties
sed -i '/org.gradle.java.home.set=false/d' android/gradle.properties
sed -i '/android.suppressUnsupportedCompileSdk/d' android/gradle.properties

# Ensure we have the buildconfig setting
if ! grep -q "android.defaults.buildfeatures.buildconfig=true" android/gradle.properties; then
  echo -e "\n# JDK 17 specific settings\nandroid.defaults.buildfeatures.buildconfig=true" >> android/gradle.properties
fi

# Create or update the jdk-compatibility.gradle script for JDK 17
cat > android/jdk-compatibility.gradle << 'ENDSCRIPT'
/**
 * This Gradle script optimizes compatibility with JDK 17
 */

// Get the Java version being used to run Gradle
def javaVersion = System.getProperty('java.version')
def majorVersion = javaVersion.split('\\.')[0].toInteger()

println "Building with Java version: ${javaVersion}"

// Verify the JDK version is appropriate
if (majorVersion != 17) {
    println "WARNING: This project is optimized for JDK 17 specifically. You are using JDK ${majorVersion}."
    println "For best results, please use JDK 17."
}

// Apply sensible JDK 17 settings
allprojects {
    tasks.withType(JavaCompile).configureEach {
        // These are the default Java 17 compiler settings
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}
ENDSCRIPT

# Apply the JDK compatibility script in the main build.gradle
if ! grep -q "jdk-compatibility.gradle" android/build.gradle; then
  sed -i 's/apply from: "variables.gradle"/apply from: "variables.gradle"\napply from: "jdk-compatibility.gradle"/' android/build.gradle
fi

# Step 7: Create a zip archive of the Android project
echo "Creating Android project ZIP archive..."
zip -r SoulCare-Android-Project.zip android capacitor.config.ts ANDROID_BUILD_INSTRUCTIONS.md ANDROID_VERSION_INFO.md

echo "===== Android project packaged successfully ====="
echo "The Android project has been packaged as SoulCare-Android-Project.zip"
echo "You can download this file and import it into Android Studio to build the APK."
echo "Please follow the instructions in ANDROID_BUILD_INSTRUCTIONS.md to build the APK."
