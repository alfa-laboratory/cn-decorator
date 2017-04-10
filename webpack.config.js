const path = require('path');
const merge = require('webpack-merge');
const ARUI_WEBPACK_TEMPLATE = require('arui-presets/webpack.base');
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
        }
    }
);

module.exports = merge.smart(
    webpackConfig,
    !IS_PRODUCTION && ARUI_WEBPACK_DEV_TEMPLATE
);
