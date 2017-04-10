const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ARUI_WEBPACK_TEMPLATE = require('arui-presets/webpack.base');

const IS_BENCHMARK = !!process.env.BENCHMARK;

const webpackConfig = merge.smart(ARUI_WEBPACK_TEMPLATE, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    merge.smart(webpackConfig, {
        devtool: 'inline-source-map'
    });
}

let babelLoaderConfig = webpackConfig.module.loaders.find(l => l.loader === 'babel-loader');
delete babelLoaderConfig.exclude;

module.exports = function (config) {
    const cfg = {
        browsers: ['PhantomJS_Desktop'],

        singleRun: true,

        plugins: [
            require('karma-webpack'),
            require('karma-chrome-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-sourcemap-loader')
        ],

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true,
            quiet: true
        },

        customLaunchers: {
            PhantomJS_Desktop: {
                base: 'PhantomJS',
                options: {
                    viewportSize: {
                        width: 1280,
                        height: 100
                    }
                }
            }
        },

        browserNoActivityTimeout: 20000
    };

    if (!IS_BENCHMARK) {
        cfg.webpack = merge.strategy({ 'module.loaders': 'append' })(
            cfg.webpack,
            {
                module: { loaders: [
                    {
                        test: /\.jsx$/,
                        loader: 'isparta',
                        include: path.resolve('src')
                    }
                ] }
            }
        );

        Object.assign(cfg, {
            frameworks: ['mocha', 'chai-spies', 'chai-dom', 'chai'],
            reporters: ['mocha', 'coverage', 'junit'],
            preprocessors: {
                './src/*': ['webpack', 'sourcemap']
            },
            files: ['./src/*-test.js?(x)'],
            coverageReporter: {
                check: {
                    global: {
                        statements: 86,
                        branches: 80,
                        functions: 95,
                        lines: 40
                    }
                }
            },
            junitReporter: {
                outputFile: 'test-results.xml',
                useBrowserName: false
            }
        });

        cfg.plugins.push(
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-chai-spies'),
            require('karma-chai-dom'),
            require('karma-mocha-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage')
        );
    } else {
        Object.assign(cfg, {
            frameworks: ['benchmark'],
            reporters: ['benchmark'],
            preprocessors: {
                './src/*': ['webpack', 'sourcemap']
            },
            files: ['./src/*-benchmark.js?(x)']
        });

        cfg.plugins.push(
            require('karma-bench'),
            require('karma-benchmark-reporter')
        );
    }

    config.set(cfg);
};
