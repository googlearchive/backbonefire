/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/backbonefire.js'],
        dest: 'dist/backbonefire.js'
      }
    },

    uglify : {
      options: {
        preserveComments: "some"
      },
      app : {
        files : {
          'dist/backbonefire.min.js' : ['src/backbonefire.js']
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
      all : ['src/backbonefire.js']
    },

    watch : {
      scripts : {
        files : 'src/backbonefire.js',
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
        src: 'src/backbonefire.js',
        dest: 'examples/todos/js/backbonefire.js',
      },
    },

    serve: {
      options: {
        port: 9000,
          'serve': {
            'path': 'examples/todos'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-karma');

  // Unit tests
  grunt.registerTask('test', ['karma:unit']);

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['build', 'test']);
  grunt.registerTask('todo', ['build', 'connect']);
};
