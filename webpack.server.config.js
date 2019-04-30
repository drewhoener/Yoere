const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {

    return ({
        entry: {
            server: './src/server/server-dev.js',
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