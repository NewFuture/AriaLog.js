var path = require('path');
var webpack = require('webpack');

module.exports = {

    entry: './src/index.ts',

    output: {
        filename: 'logger.js',
        path: path.resolve(__dirname, './dist'),
    },

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            mangle: {
                // mangle options
                reserved: [],
                toplevel: true,
                properties: {
                    reserved: [],
                    // regex: /.*/,
                    // mangle property options
                }
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
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}