const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        flightStatus: './src/main/resources/assets/src/flightStatusScript.js',
        dispatcherView: './src/main/resources/assets/src/dispatcherScript.js',
        checkin: './src/main/resources/assets/src/checkinScript.js',
        waitingRoom: './src/main/resources/assets/src/waitingRoomScript.js'
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/assets/dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-react"] }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['src/main/resources/assets/dist']),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Flight Status',
            favicon: './src/main/resources/assets/src/images/icon.ico',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['flightStatus'],
            filename: 'flightStatus.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Dispatcher View',
            favicon: './src/main/resources/assets/src/images/icon.ico',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['dispatcherView'],
            filename: 'dispatcherView.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Check In',
            favicon: './src/main/resources/assets/src/images/icon.ico',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['checkin'],
            filename: 'checkin.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Waiting Room',
            favicon: './src/main/resources/assets/src/images/icon.ico',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['waitingRoom'],
            filename: 'waitingRoom.html' //relative to root of the application
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            test: /\.(js|jsx)$/
        })],
    }
};