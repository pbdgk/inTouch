
const config = {
    mode: 'development',
    entry: {
        messages: './chatex/frontend/src/index.js',
        profile: './chatex/frontend/src/profile.js',
    },
   
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/chatex/frontend/static/frontend/bundles'
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
    }
}


module.exports = config;
