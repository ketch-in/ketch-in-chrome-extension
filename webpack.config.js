const path = require('path');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = (env) => {
  const isProduction = env.mode === 'production';

  return {
    mode: env.mode,
    devtool: isProduction ? 'source-map' : 'inline-cheap-source-map',
    entry: {
      'background': path.resolve(__dirname, './src/background.ts'),
      'content': path.resolve(__dirname, './src/content.ts'),
      'popup': path.resolve(__dirname, './src/popup/popup.ts'),
      'fetch-interceptor': path.resolve(__dirname, './src/interceptor'),
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
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
        template: path.resolve(__dirname, './src/popup/popup.html'),
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
