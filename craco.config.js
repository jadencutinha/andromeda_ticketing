// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Create a fallback for node core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/"),
      };

      // Use the ProvidePlugin to make Buffer and process available globally.
      // This is the most common way to handle libraries that expect these to exist.
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: 'process/browser', // Points to the process/browser.js file in the 'process' package
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);

      // This rule helps with some libraries that have issues with source-maps.
      // It's a good defensive measure to have.
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      
      return webpackConfig;
    },
  },
};