const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfig = {
    context: __dirname, //path.resolve()
    entry: './src/app.js',
    output: {
        path: __dirname + '/dist', //path.resolve(__dirname, 'dist')
        filename: 'js/app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: __dirname + '/node_modules', //path.resolve(__dirname, 'node_modules')
                include: __dirname + '/src', //360ms左右，使用path.resolve(__dirname, 'src')速度更慢，3600ms左右
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.tpl$/,
                use: [
                    {
                        loader: "ejs-loader"
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/[name]-[hash:5].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: 'body', //默认是body
        title: 'webpack verajhu'
    })]
};

module.exports = webpackConfig;