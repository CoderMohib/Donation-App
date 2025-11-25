const fs = require('fs');
const path = require('path');

// Write google-services.json from environment variable during config generation
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;
if (googleServicesJson) {
  const outputPath = path.join(__dirname, 'google-services.json');
  try {
    fs.writeFileSync(outputPath, googleServicesJson);
    console.log('✅ Successfully wrote GOOGLE_SERVICES_JSON to google-services.json');
  } catch (error) {
    console.error('❌ Failed to write google-services.json:', error);
  }
}

module.exports = {
  expo: {
    name: "Donation App",
    slug: "Donation-App",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/app_logo.png",
    scheme: "donationapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/app_logo.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.sheikmobii.donationapp",
      versionCode: 2,
      softwareKeyboardLayoutMode: "pan"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/app_logo.png",
          color: "#10b981",
          sounds: []
        }
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/app_logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "b51c7981-3b47-4881-8728-2a09964d96e3"
      }
    }
  }
};