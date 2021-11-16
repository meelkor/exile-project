/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => ({
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, './build.tsconfig.json'),
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(ttf|png)$/,
                use: {
                    loader: 'file-loader',
                },
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@exile/common': path.resolve(__dirname, '../common/src'),
            '@exile/client': path.resolve(__dirname, './src'),
            ...(env.three ? {
                'three': path.resolve(__dirname, env.three),
            }: {}),
            ...(env['troika-text'] ? {
                'troika-three-text': path.resolve(__dirname, env['troika-text']),
            }: {}),
        },
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './src/assets',
                    to: './assets',
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
});
