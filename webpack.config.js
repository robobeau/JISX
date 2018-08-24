const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: 'ts-loader'
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: 'jisx.js',
      path: path.resolve(__dirname, 'pub')
    }
  };