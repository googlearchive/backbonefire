module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],

    preprocessors: {
      '**/*.coffee': ['coffee'],
      '../src/*.js': 'coverage'
    },

    files: [
      '../bower_components/underscore/underscore.js',
      '../bower_components/backbone/backbone.js',
      '../test/fixtures.coffee',
      '../src/backfire.js',
      'specs/*_test.coffee'
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
