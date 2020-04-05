/* eslint-disable */
const isDocker = require('is-docker')();

const thresholdConfigsGlobal ={ statements: 75,functions: 75 };
const thresholdConfigsFile =  { functions: 80};

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      {pattern: 'src/**/!(index).ts'},
      {pattern: 'src/**/*.ts'},
      {pattern: 'src/**/*.scss',},
    ],
    preprocessors: {
            "**/!(index).ts": "karma-typescript",
            'src/**/*.scss': ['scss']

    },
    reporters: [
      'spec',
      'karma-typescript',
      'istanbul-threshold'
    ],
    port: 9876,  // karma web server port
    colors: true,
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
    karmaTypescriptConfig: {
        bundlerOptions: {
            transforms: [require("karma-typescript-es6-transform")()]
        },
        tsconfig: "./src/client/tsconfig.json",
        reports: {
          "html": "coverage",
          "json": {"directory": "coverage", "subdirectory":"json", "filename":"report.json"},
        },
        coverageOptions: {
          threshold: {
            global: thresholdConfigsGlobal,
            files: thresholdConfigsFile
          },
        },
    },
    captureTimeout: 30000,
    specReporter: {
      suppressErrorSummary: false,
      suppressFailed: false, 
    },
    istanbulThresholdReporter: {
      reporters: ['text'], 
      basePath: __dirname,
      src: 'coverage/json/report.json',
      thresholds: {
        global: thresholdConfigsGlobal,
        each: thresholdConfigsFile
      } 
    }
  })
}