/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/backfire.js'],
        dest: 'dist/backfire.js'
      }
    },

    uglify : {
      options: {
        preserveComments: "some"
      },
      app : {
        files : {
          'dist/backfire.min.js' : ['src/backfire.js']
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
          'Backbone' : false,
          'Firebase' : false
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
      all : ['src/backfire.js']
    },

    watch : {
      scripts : {
        files : 'src/backfire.js',
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
    },

    copy: {
      main: {
        src: 'src/backfire.js',
        dest: 'examples/todos/lib/backfire.js',
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-copy');

  // Unit tests
  grunt.registerTask('test', ['karma:unit']);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);
  grunt.registerTask('default', ['build', 'test']);
};
