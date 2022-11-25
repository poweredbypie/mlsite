const path = require('path');

module.exports = {
  entry: './client/src/App.tsx',
  mode: "development",
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(css)/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf)$/i,
        exclude: /node_modules/,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.css', '.js', '.jsx', '.tsx', '.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'dist', 'client'),
    libraryTarget: "commonjs2"
  },
  optimization: {
    usedExports: true
  },
  devServer: {
    static: path.resolve(__dirname, '..', "dist", 'client')
  }
};