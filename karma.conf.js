/* eslint-disable */
const isDocker = require('is-docker')();
const webpackConfig = require('./webpack.config');
const path = require('path');

delete webpackConfig.entry

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {pattern: 'src/**/!(index).ts'},
      {pattern: 'src/**/*.ts'},
      {pattern: 'src/**/*.scss',},
    ],
    preprocessors: {
            "**/!(index).ts": ['webpack', 'sourcemap'],
            'src/**/*.scss': ['scss']

    },
    reporters: [
      'spec',
      'coverage-istanbul'
    ],

    port: 9876,
    colors: true,
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      mode: webpackConfig.mode,
      devtool: 'inline-source-map',
    },
    logLevel: config.LOG_ERROR,
    customLaunchers: {
        ChromeCustom: {
            base: 'ChromeHeadless',
            // We must disable the Chrome sandbox when running Chrome inside Docker (Chrome's sandbox needs
            // more permissions than Docker allows by default)
            flags: isDocker ? ['--no-sandbox'] : [],
        }
    },
    browserNoActivityTimeout: 60000,
    captureTimeout: 30000,
    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false, 
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'text-summary', 'lcovonly' ],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      'report-config': {
        html: { outdir: 'coverage' }
      },
      thresholds :{
        emitWarning: false,
        global: {statements: 75, functions: 75},
        each: {functions: 80}
      }
    }
  })
}