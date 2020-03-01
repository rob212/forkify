// this path module is required to calc an absolute path which is needed for the webpack output
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// This is the config file for bundling our js files together into one js file to be used to deploy 
module.exports = {
    // this is the location of our js we would like to be bundled
    entry: ['./src/js/index.js'],
    output: {
        // this is the absolute path of where the bundled code should be placed by webpack
        path: path.resolve(__dirname, 'dist'),
        // this is the name of the bundle file we produce.
        filename: 'js/bundle.js'
    },
    // in webpack 4 and above you can define dev or prod mode. Dev will not minify the js or do tree shaking optimizations
    // prod mode will. But for development we don't want minified files for debugging and we want to save time
    // Instead of having it hard coded here I will create two seperate npm script in package.json so we can choose
    //mode: 'development'

    // dev server provides a simple local web server with live reloading for development
    devServer: {
        contentBase: './dist'
    },

    // This webpack plugin simplifies the creation of our index.html in the dist directory
    // when running the dev server it generates a new index.html file from a copy of our existing
    // src/index.html file but also includes the js/budle.js script in it configured in the output setup above.
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    // loaders in Webpack allow us to load and process files. E.g. convert Sass to css or converting ES6 to Es5
    // We are using the babel loader for this
    module: {
        rules: [
            {
                // regex to find all .js files
                test: /\.js$/,
                // do not convert anything in the node_modules folder
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

