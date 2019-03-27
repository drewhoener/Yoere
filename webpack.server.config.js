const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const plugin_htmlWebpack = require('html-webpack-plugin');

module.exports = (env, argv) => {

    const ENTRY = (argv.mode === 'production') ?
        './src/server/server-prod.js' :
        './src/server/server-dev.js';

    return ({
        entry: {
            server: ENTRY,
        },
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: '[name].js'
        },
        target: 'node',
        //Apparently this is required. Gotta make time to learn how this really works
        //For some reason express needs this because routing?
        node: {
            __dirname: false,
            __filename: false
        },
        //Express also needs this?
        externals: [nodeExternals()],
        module: {
            rules: [
                //Bring it all back to ES5
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    }
                }
            ]
        }
    });
};