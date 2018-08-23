var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.ts',

    output: {
        filename: 'logger.js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    allowTsInNodeModules: true,
                },
                // include: __dirname,
                // exclude: /node_modules/
            }
        ]
    },
}

if (process.env.NODE_ENV === 'production') {
    module.exports.mode = "production"
    module.exports.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true,
                uglifyOptions: {
                    mangle: true,
                    output: {
                        comments: false,
                    },
                    compress: {
                        properties: true,
                        loops: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        conditionals: true,
                        comparisons: true,
                        booleans: true,
                        drop_debugger: true,
                        if_return: true,
                        join_vars: true,
                        unused: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                    }
                }
            }),
        ]
    };
}