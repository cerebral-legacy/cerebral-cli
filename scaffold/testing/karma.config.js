var webpack = require('webpack');
var path = require('path');
var argv = require('yargs').argv;

var reporters = ['spec'];
if (argv.coverage) reporters = reporters.concat(['coverage', 'threshold']);
var phantomjs = argv.debug ? ['PhantomJS_debug'] : ['PhantomJS'];
var browsers = argv.chrome ? ['Chrome'] : phantomjs;
var singleRun = argv.debug ? false : !argv.watch;

module.exports = function(config) {
  config.set({
    browsers: browsers,
    customLaunchers: {
      'PhantomJS_debug': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
    singleRun: singleRun,
    frameworks: ['mocha', 'chai'],
    reporters: reporters,
    browserNoActivityTimeout: argv.debug ? 500000 : 10000,
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      {
        pattern: './test/**/*.js',
        watched: false,
        served: true,
        included: true
      }
    ],
    preprocessors: {
      ['./test/**/*.js']: ['webpack', 'sourcemap']
    },
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-threshold-reporter'
    ],
    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type : 'lcov', subdir: 'report-lcov' }
      ]
    },
    thresholdReporter: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    },
    webpackMiddleware: {
      noInfo: true
    },
    webpack: { // semi-copy of webpack.config.js
      devtool: 'inline-source-map',
      resolve: {
        root: path.resolve(__dirname, './src'),
        alias: {
          'sinon': 'sinon/pkg/sinon'
        }
      },
      module: {
        noParse: [
          /node_modules\/sinon\//
        ],
        loaders: [{
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            "presets": [],
            "plugins": []
          }
        }]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
          }
        })
      ],
      externals: {}
    }
  });
};
