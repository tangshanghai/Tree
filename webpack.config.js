/**
 * Created by tangshanghai on 2016/12/26.
 */
var path = require('path');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//用于在构建前清除dist目录中的内容
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: {
        app:"./src/Tree.js",
        //vendor:["./src/lib/flv.js","./src/lib/hls.min.js"]
    },
    output: {
        path: path.resolve(__dirname +'/dist'),
        filename: "Tree.js",
        library: 'Tree',
        libraryExport: "default",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js|jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', "stage-0"]
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=10240&name=dist/img/[hash:8].[name].[ext]'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
            //,
            //{
            //    test:'./src/lib/flv.min.js',
            //    loader:"imports?flvjs=flvjs,this=>window"
            //}
            //{
            //    // 得到jquery模块的绝对路径
            //    test: '../jquery.js',
            //    // 将jquery绑定为window.jQuery
            //    loader: 'expose?window.jQuery'
            //}

            //{
            //    test: "./src/lib/flv.js",
            //    loader: 'expose?window.flvjs'
            //},
            //{
            //    test: "./src/lib/hls.min.js",
            //    loader: 'expose?Hls'
            //}
        ]
    },
    plugins: [
    //    new webpack.ProvidePlugin({
    //        $: "jquery",
    //        jQuery: "jquery",
    //        "window.jQuery": "jquery"
    //    })
        // 生成html文件
        new HtmlWebpackPlugin({ 
            // 输出文件名字及路径
            filename: 'index.html',
            template: 'index.html'
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './assets'),
                to: '',
            }
        ]),
        //清除dist构建目录文件
        new CleanWebpackPlugin(['dist/*']),
    ]
    //externals: {
    //    "jquery": "jQuery"
    //}
    
}