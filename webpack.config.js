const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ARUI_WEBPACK_TEMPLATE = require('arui-presets/webpack.base');
const ARUI_WEBPACK_PROD_TEMPLATE = require('arui-presets/webpack.production');
const ARUI_WEBPACK_DEV_TEMPLATE = require('arui-presets/webpack.development');

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const webpackConfig = merge.smart(
    ARUI_WEBPACK_TEMPLATE,
    {
        entry: path.resolve('src', 'cn.js'),
        output: {
            path: path.resolve('dist'),
            filename: 'cn.js',
            libraryTarget: 'commonjs2'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            })
        ]
    }
);

module.exports = merge.smart(
    webpackConfig,
    IS_PRODUCTION ? ARUI_WEBPACK_PROD_TEMPLATE : ARUI_WEBPACK_DEV_TEMPLATE
);
