module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
  overrides: [{
    "plugins": [
      ["@babel/plugin-transform-private-methods", {
      "loose": true
    }]
    ]
  }]
};
