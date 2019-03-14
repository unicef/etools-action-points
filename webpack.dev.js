const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.',
    compress: true,
    port: 8080
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'service-worker.js',
        to: './service-worker.js',
        toType: 'file'
      }
    ], {})
  ]
});
