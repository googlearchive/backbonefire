module.exports = function(config) {
  var srcPreprocessors = 'coverage';
  var reporters = ['spec', 'failed'];
  function isDebug(arg) {
    return arg === '--debug';
  }
  if (process.argv.some(isDebug)) {
    sourcePreprocessors = [];
  } else {
    reporters.push('coverage');
  }
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],

    preprocessors: {
      '../src/*.js': srcPreprocessors
    },

    files: [
      '../bower_components/underscore/underscore.js',
      '../bower_components/backbone/backbone.js',
      '../bower_components/mockfirebase/browser/mockfirebase.js',
      'fixtures.js',
      '../src/backbonefire.js',
      './specs/*_test.js'
    ],

    reporters: reporters,
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
