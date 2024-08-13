const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    devtool: "inline-source-map",

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],//расширения файлов которые мы поддерживаем ts compile
    },

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

    module: {//подключаемые модули
        rules: [
            {// подключаем ts-loader(загрузчик модулей) из node_modules, для использование системы модулей в проекте формата es6 amd и т.д. (не нужно указывать расширение для импортируемых файлов в проекте)
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
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