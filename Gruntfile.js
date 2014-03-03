/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    uglify : {
      app : {
        files : {
          'backbone-firebase.min.js' : ['backbone-firebase.js']
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
      all : ['backbone-firebase.js']
    },

    watch : {
      scripts : {
        files : 'backbone-firebase.js',
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

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('build', ['jshint', 'uglify']);
  grunt.registerTask('default', ['build']);
};
