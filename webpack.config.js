const path = require('path');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = (env) => {
  return {
    mode: env.mode,
    entry: {
      background: path.resolve(__dirname, './src/ts/background.ts'),
      content: path.resolve(__dirname, './src/ts/content.ts'),
      popup: path.resolve(__dirname, './src/ts/popup.ts'),
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['ts', 'js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new HtmlPlugin({
        template: path.resolve(__dirname, './src/popup.html'),
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './public/**/*',
            to: './[name][ext]',
          },
        ],
      }),
      new DotenvPlugin({
        path: `./${env.mode}.env`,
      }),
    ],
  };
};
