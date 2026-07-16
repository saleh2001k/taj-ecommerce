// Default Expo Metro config. Unistyles 3 works through its Babel plugin,
// so no extra Metro transformer is required — we keep this explicit for
// future customization (svg transformer, monorepo roots, etc.).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
