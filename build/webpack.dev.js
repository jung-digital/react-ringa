const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const path = require('path');
const ROOT_PATH = path.resolve(process.env.PWD);
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

module.exports = Object.assign({
  devtool: 'source-map',
  entry: path.resolve(ROOT_PATH, 'src/index'),
  output: {
    path: path.join(ROOT_PATH, 'dist'),
    filename: 'react-ringa.js',
    publicPath: '/',
    library: 'React Ringa',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new WebpackBundleSizeAnalyzerPlugin('./dist/reports/webpacksize.txt')
  ]
}, baseConfig);
