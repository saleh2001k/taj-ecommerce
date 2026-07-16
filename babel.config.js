module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Unistyles must transform every file that uses StyleSheet/theme.
      // `root: 'src'` = all of our app + components live under src/.
      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
        },
      ],
      // react-native-worklets (Reanimated 4) plugin must stay last.
      'react-native-worklets/plugin',
    ],
  };
};
