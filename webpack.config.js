const webpack = require('webpack');

const config = {
    mode: 'development',
    entry: {
        messages: './src/frontend/src/index.js',
        profile:  './src/frontend/src/profile.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/src/frontend/static/frontend/bundles'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            },

        }]
    },
    watch: true
}


module.exports = config;
