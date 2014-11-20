module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],

    preprocessors: {
      '../src/*.js': 'coverage'
    },

    files: [
      '../bower_components/underscore/underscore.js',
      '../bower_components/backbone/backbone.js',
      '../bower_components/mockfirebase/browser/mockfirebase.js',
      'fixtures.js',
      '../src/backbonefire.js',
      './specs/*_test.js'
    ],

    reporters: ['spec', 'failed', 'coverage'],
    coverageReporter: {
      reporters: [
        {
          type: 'lcovonly',
          dir: 'coverage',
          subdir: '.'
        },
        {
          type: 'text-summary'
        }
      ]
    },

    port: 9876,

    browsers: ['PhantomJS'],

    singleRun: false,
    autoWatch: true
  });
};
