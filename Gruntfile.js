/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    uglify : {
      app : {
        files : {
          'backfire.min.js' : ['backfire.js']
        }
      }
    },

    jshint : {
      options : {
        'bitwise' : true,
        'boss'    : true,
        'browser' : true,
        'curly'   : true,
        'devel'   : true,
        'eqnull'  : true,
        'globals' : {
          'Backbone'            : false,
          'Firebase'            : false
        },
        'globalstrict' : true,
        'indent'       : 2,
        'latedef'      : true,
        'maxlen'       : 115,
        'noempty'      : true,
        'nonstandard'  : true,
        'undef'        : true,
        'unused'       : true,
        'trailing'     : true
      },
      all : ['backfire.js']
    },

    watch : {
      scripts : {
        files : 'backfire.js',
        tasks : ['default', 'notify:watch'],
        options : {
          interrupt : true
        }
      }
    },

    notify: {
      watch: {
        options: {
          title: 'Grunt Watch',
          message: 'Build Finished'
        }
      }
    },

    // Unit tests
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
      },
      unit: {
        autowatch: false,
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');

  // Unit tests
  grunt.registerTask('test', ['karma:unit']);

  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('default', ['build', 'test']);
};
