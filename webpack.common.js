const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: ['./index.ts'],
  externals: [nodeExternals()],
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        exclude: [/(node_modules)/, /__test__/],
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json'],
  },
};
