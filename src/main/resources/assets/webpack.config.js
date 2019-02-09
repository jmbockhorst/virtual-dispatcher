const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        flightStatus: './src/flightStatusScript.js',
        dispatcherView: './src/dispatcherScript.js',
        checkin: './src/checkinScript.js',
        waitingRoom: './src/waitingRoomScript.js'
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
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
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Flight Status',
            favicon: './src/images/icon.ico',
            template: './src/index.html',
            chunks: ['flightStatus'],
            filename: 'flightStatus.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Dispatcher View',
            favicon: './src/images/icon.ico',
            template: './src/index.html',
            chunks: ['dispatcherView'],
            filename: 'dispatcherView.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Check In',
            favicon: './src/images/icon.ico',
            template: './src/index.html',
            chunks: ['checkin'],
            filename: 'checkin.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Virtual Dispatcher - Waiting Room',
            favicon: './src/images/icon.ico',
            template: './src/index.html',
            chunks: ['waitingRoom'],
            filename: 'waitingRoom.html' //relative to root of the application
        })
    ]
};