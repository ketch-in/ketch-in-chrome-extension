const path = require('path');

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
      ],
    },
  };
};
