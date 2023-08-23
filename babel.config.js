module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src/',
          '@screens': './src/screens',
          '@common': './src/common',
          '@images': './src/common/assets/images',
        },
      },
    ],
    ['module:react-native-dotenv'],
  ],
};
