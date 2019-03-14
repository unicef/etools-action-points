const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src_ts/app-shell.ts',
  target: 'web',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CleanWebpackPlugin(['src']),
    new CopyWebpackPlugin([
      {
        from: 'images/*',
        to: '.',
        toType: 'dir'
      },
      {
        from: 'index.html',
        to: '.',
        toType: 'dir'
      },
      {
        from: 'images/favicon.ico',
        to: 'favicon.ico'
      },
      {
        from: path.resolve(__dirname, 'node_modules/@webcomponents/webcomponentsjs/*.js'),
        to: 'node_modules/@webcomponents/webcomponentsjs/[name].[ext]'
      }
    ], {})
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src')
  }
};
