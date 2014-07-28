// Karma configuration
// Generated on Mon Nov 25 2013 16:59:31 GMT-0500 (EST)

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/underscore/underscore.js',
      'bower_components/backbone/backbone.js',
      'test/fixtures.coffee',
      'backfire.js',
      'test/specs/*_test.coffee'
    ],

    reporters: ['dots', 'failed'],

    port: 9876,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    preprocessors: {
      '**/*.coffee': ['coffee']
    }
  });
};
