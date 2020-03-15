const path = require('path');

const PUBLIC_FILE_PATH = path.join(__dirname, 'build', 'public');

module.exports = {
    entry: path.join(__dirname, 'src', 'client', 'index.ts'),
    devtool: 'inline-source-map',
    devServer: {
        contentBase: PUBLIC_FILE_PATH
    },
    output: {
        filename: 'bundle.js',
        path: PUBLIC_FILE_PATH,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};