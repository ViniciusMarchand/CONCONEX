const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Settings to ignore "react-dom"
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'react-dom': path.resolve(__dirname, 'node_modules', 'react-native'), // Redirect to react-native
  },
};

module.exports = withNativeWind(config, { input: './global.css' });