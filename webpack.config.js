const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event || 'build';
const developmentConfig = require('./webpack/development');

let common = {
  entry: {
    app: path.resolve(__dirname, 'src')
  },
  output: {
    path: path.resolve(__dirname,'build/dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/build/dist/'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            modules: true
          }
        }
      },
      {
        test: /\.js$/,
        use: {
            loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: ['style-loader'],
            use:[
                {
                    loader:"css-loader",
                    query: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName : '[name]__[local]___[hash:base64:5]'
                    }
                },
                {
                    loader: "postcss-loader"
                }
            ],
            publicPath: "/build/dist" // Overrides output.publicPath
        })
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions']
          })
        ]
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      disable: false,
      allChunks: true
    }),
    new CopyWebpackPlugin([
      {from: 'src/assets', to: '../assets'},
      {from: 'src/index.html', to: '../index.html'}
    ])
  ]
}

let config = common;

if ((TARGET === 'start') || (TARGET === undefined)) {
    config = merge(common, {
        debug: true,
        plugins: [],
        devtool: 'eval'
    })

    config = merge(common, developmentConfig.devServer());
}

module.exports = config;
