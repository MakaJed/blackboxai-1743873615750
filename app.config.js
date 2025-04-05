export default {
  name: 'NDV Detector',
  slug: 'ndv-detector',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.ndvdetector'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#4CAF50'
    },
    package: 'com.yourcompany.ndvdetector'
  },
  extra: {
    modelPath: './assets/models/model.json'
  }
};