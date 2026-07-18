const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function main() {
  try {
    console.log('🚀 Building Android APK...\n');

    // Change to android directory and build APK
    process.chdir('android');
    console.log('📦 Running gradle build...');
    execSync('./gradlew assembleRelease', { stdio: 'inherit' });

    // Find the generated APK file
    const apkDir = path.join('app', 'build', 'outputs', 'apk', 'release');
    const apkFiles = fs.readdirSync(apkDir).filter(file => file.endsWith('.apk'));

    if (apkFiles.length === 0) {
      throw new Error('No APK files found in the build output directory');
    }

    const apkFile = apkFiles[0]; // Use the first APK file found
    const sourcePath = path.join(apkDir, apkFile);

    // Get app name from package.json
    const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    const appName = packageJson.name || 'app';

    // Create destination filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const destinationFilename = `${appName}-${timestamp}.apk`;
    const destinationPath = path.join('..', destinationFilename);

    // Copy APK to root directory
    console.log(`\n📱 Copying APK to root directory...`);
    fs.copyFileSync(sourcePath, destinationPath);

    console.log(`\n✅ APK built successfully!`);
    console.log(`📁 Location: ${destinationFilename}`);
    console.log(`📊 Size: ${(fs.statSync(destinationPath).size / 1024 / 1024).toFixed(2)} MB`);

    // Change back to root directory
    process.chdir('..');
  } catch (error) {
    console.error('\n❌ Error building APK:', error.message);

    if (error.message.includes('gradlew')) {
      console.log('\n💡 Tips:');
      console.log('1. Make sure you have Android SDK installed and configured');
      console.log('2. Ensure ANDROID_HOME environment variable is set');
      console.log('3. Run `./gradlew clean` in the android directory if build fails');
    }

    process.exit(1);
  }
}

main();
