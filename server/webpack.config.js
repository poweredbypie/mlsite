const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  mode: "production",
  externals: [nodeExternals()],
  externalsPresets: {
    node: true
  },
  entry: path.resolve(__dirname, "src", "main.ts"),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "..", 'dist', 'server'),
  },
};