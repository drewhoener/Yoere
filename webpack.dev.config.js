const path = require('path');
const webpack = require('webpack');
const plugin_htmlWebpack = require('html-webpack-plugin');
const plugin_copyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/node/',
        filename: '[name].js'
    },
    mode: 'development',
    target: 'web',
    devtool: "#source-map",
    module: {
        rules: [
            //Bring it all back to ES5
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                }]
            },
            //Pack bundled js into html
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new plugin_htmlWebpack({
            template: "./src/html/index.html",
            filename: "./index.html",
            excludeChunks: ['server']
        }),
        new plugin_htmlWebpack({
            template: "./src/html/game.html",
            filename: "./game.html",
            excludeChunks: ['server']
        }),
        new plugin_htmlWebpack({
            template: "./src/html/highscore.html",
            filename: "./highscore.html",
            excludeChunks: ['server']
        }),
        new plugin_htmlWebpack({
            favicon: "./src/img/favicon.ico",
            excludeChunks: ['server']
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new plugin_copyWebpackPlugin([
            {from: 'src/img', to: 'img'}
        ])
    ]
};