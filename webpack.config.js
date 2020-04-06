/* eslint-disable */
const path = require('path');

const PUBLIC_FILE_PATH = path.join(__dirname, 'build', 'public');

module.exports = {
    entry: path.join(__dirname, 'src', 'client', 'index.ts'),
    devtool: 'inline-source-map',
    devServer: {
        contentBase: PUBLIC_FILE_PATH,
        host: '0.0.0.0',
        publicPath: '/build/public/',
        port: 80,
        watchOptions: {
            aggregateTimeout: 500,
            poll: 1000,
            ignored: ['src/server/**', 'node_modules/**', 'src/**/*test.ts'],
        },
    },
    output: {
        filename: 'bundle.js',
        path: PUBLIC_FILE_PATH,
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: [/node_modules/,],
            },
            {
                test: /\.ts$/,
                exclude: [/\.test.ts?$/, /test-utils/],
                enforce: 'post',
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                }
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
      mode: 'development'
};
