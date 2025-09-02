const path = require('path');

module.exports = {
  entry: {
    createItem: './src/handlers/createItem.ts',
    getItems: './src/handlers/getItems.ts',
  },
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    'aws-sdk': 'aws-sdk',
  },
};

