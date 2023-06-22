const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const distdir = path.resolve(__dirname, '..', 'dist', 'client')

module.exports = {
  entry: './src/App.tsx',
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.(css)/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf)$/i,
        exclude: /node_modules/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.css', '.js', '.jsx', '.tsx', '.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: distdir,
  },
  optimization: {
    usedExports: true,
  },
  devServer: {
    static: distdir,
  },
}
