const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,//сервер переводит с 404 на наш index.html(дальше выполняется прописанная логика на фронте)
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./src/static", to: "static" },
                { from: "./src/templates", to: "templates" },
                { from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles" },
                { from: "./src/styles", to: "styles" },
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
};