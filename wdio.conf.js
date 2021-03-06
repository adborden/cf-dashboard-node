/* eslint-disable */
var PORT = process.env.PORT || 8001;

exports.config = {
  specs: [
    './static_src/test/functional/**/*.spec.js'
  ],

  capabilities: [{
    browserName: 'chrome'
  }],

  sync: true,
  logLevel: 'error',
  coloredLogs: true,

  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,

  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './screenshots/',

  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: 'http://localhost:' + PORT,

  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,

  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,

  // Default request retries count
  connectionRetryCount: 3,

  services: ['selenium-standalone'],
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000
  },

  before: function () {
    require('babel-register');
  }
};
