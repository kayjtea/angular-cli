import * as fs from 'fs';
import * as path from 'path';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as webpack from 'webpack';
import { ForkCheckerPlugin } from 'awesome-typescript-loader';
import { CliConfig } from './config';

export function getWebpackCommonConfig(projectRoot: string, sourceDir: string) {
  function findMainStylesheets(): string[] {
    function getFileNameWithExtension(extension){
      return path.resolve(projectRoot, `./${sourceDir}/main.${extension}`);
    }
    return ['scss', 'styl', 'less', 'css'].filter((extension) => {
      return fs.existsSync(getFileNameWithExtension(extension));
    }).map((extension) => {
      return getFileNameWithExtension(extension);
    });
  }
  return {
    devtool: 'source-map',
    resolve: {
      extensions: ['', '.ts', '.js'],
      root: path.resolve(projectRoot, `./${sourceDir}`)
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '../../../node_modules')],
    },
    context: path.resolve(__dirname, './'),
    entry: {
      main: [path.resolve(projectRoot, `./${sourceDir}/main.ts`)],
      styles: findMainStylesheets(),
      polyfills: path.resolve(projectRoot, `./${sourceDir}/polyfills.ts`)
    },
    output: {
      path: path.resolve(projectRoot, './dist'),
      filename: '[name].bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.ts$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              query: {
                useForkChecker: true,
                tsconfig: path.resolve(projectRoot, `./${sourceDir}/tsconfig.json`)
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },
        { test: /\.json$/, loader: 'json-loader'},
        {
          test: /\.css$/,
          exclude: findMainStylesheets(),
          loaders: ['raw-loader', 'postcss-loader?sourceMap']
        },
        {
          test: /\.css$/,
          include: findMainStylesheets(),
          loaders: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap'])
        },
        {
          test: /\.styl$/,
          exclude: findMainStylesheets(),
          loaders: ['raw-loader', 'postcss-loader?sourceMap', 'stylus-loader?sourceMap']
        },
        {
          test: /\.styl$/,
          include: findMainStylesheets(),
          loaders: ExtractTextPlugin.extract(['css-loader', 'postcss-loader?sourceMap', 'stylus-loader?sourceMap'])
        },
        {
          test: /\.less$/,
          exclude: findMainStylesheets(),
          loaders: ['raw-loader', 'postcss-loader?sourceMap', 'less-loader?sourceMap']
        },
        {
          test: /\.less$/,
          include: findMainStylesheets(),
          loaders: ExtractTextPlugin.extract(['css-loader', 'postcss-loader?sourceMap', 'less-loader?sourceMap'])
        },
        {
          test: /\.scss$|\.sass$/,
          exclude: findMainStylesheets(),
          loaders: ['raw-loader', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
        },
        {
          test: /\.scss$|\.sass$/,
          include: findMainStylesheets(),
          loaders: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap'])
        },
        { test: /\.(svg|gif|jpg|jpeg|png)$/, loader: 'url-loader?limit=128000&name=images/[hash].[ext]'},
        { test: /\.html$/, loader: 'html-loader!markup-inline-loader' }
      ]
    },
    plugins: [
      new ExtractTextPlugin({filename: 'css/[name]_[hash].css', allChunks: true}),
      new ForkCheckerPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(projectRoot, `./${sourceDir}/index.html`),
        chunksSortMode: 'dependency'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills']
      }),
      new webpack.optimize.CommonsChunkPlugin({
        minChunks: Infinity,
        name: 'inline',
        filename: 'inline.js',
        sourceMapFilename: 'inline.map'
      }),
      new CopyWebpackPlugin([{
        context: path.resolve(projectRoot, './public'),
        from: '**/*',
        to: path.resolve(projectRoot, './dist')
      }])
    ],
    node: {
      fs: 'empty',
      global: 'window',
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  }
}
