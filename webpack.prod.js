
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
        to: '.',
        toType: 'dir'
      }
    ], {}),
    new SWPrecacheWebpackPlugin(
        {
          cacheId: 'apd',
          filename: 'service-worker.js',
          minify: true
        }
    )
  ]
});
