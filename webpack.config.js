const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },

  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 8081,
    open: true,
    hot: true,
    watchFiles: ['src/**/*'],
  },

  //  loaders
  module: {
    rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader'] }],
  },

  //  plugins
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ToDo-List',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/template.html'),
    }),
  ],
};
