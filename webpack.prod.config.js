const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const plugin_HtmlWebpack = require('html-webpack-plugin');
const plugin_UglifyJS = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    mode: 'production',
    target: 'web',
    devtool: "#source-map",
    optimization: {
        minimizer: [
            new plugin_UglifyJS({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
        ]
    },
    module: {
        rules: [
            //Bring it all back to ES5
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            //Pack bundled js into html
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {minimize: true}
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new plugin_HtmlWebpack({
            template: "./src/html/index.html",
            filename: "./index.html",
            excludeChunks: ['server']
        }),
        new plugin_HtmlWebpack({
            template: "./src/html/game.html",
            filename: "./game.html",
            excludeChunks: ['server']
        }),
        new plugin_HtmlWebpack({
            favicon: "./src/img/favicon.ico",
            excludeChunks: ['server']
        }),
    ]
};