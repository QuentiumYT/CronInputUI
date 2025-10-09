import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const entryPoints = {
  ['cron-input-ui']: './src/index.js',
  ['cron-input-ui.min']: './src/index.js',
};

let localeEntryPoints = {};
let localePath = path.resolve('src', 'i18n', 'locales');
for (let locale of fs.readdirSync(localePath)) {
  const code = path.basename(locale, path.extname(locale));
  localeEntryPoints[`dist/locales/${code}`] = path.resolve(localePath, locale);
}

export default [{
  mode: process.env.NODE_ENV || 'development',
  entry: entryPoints,
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    library: 'cron-input-ui',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'globalThis',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: {
          loader: 'source-map-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        include: /\.min\.css$/,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html',
      chunks: ['cron-input-ui'],
    }),
    new MiniCssExtractPlugin(),
  ],
},
{
  mode: 'production',
  entry: localeEntryPoints,
  output: {
    path: path.resolve(),
    filename: '[name].js',
    library: 'inputLang',
    libraryTarget: 'window',
    umdNamedDefine: true,
    globalObject: 'globalThis',
  },
}];
