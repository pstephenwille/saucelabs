'use strict';

var _ = require('lodash');

var desireds = {
  chrome: {browserName: 'chrome'},
  firefox: {browserName: 'firefox'},
  exporer: {browserName: 'internet explorer'}
}

var gruntConfig = {
    env: {
      // dynamically filled
    },
    simplemocha: {
      sauce: {
        options: {
          timeout: 60000,
          reporter: 'spec'
        },
        src: ['test/sauce/**/*-specs.js']
      }
    },    
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    concurrent: {
      'test-sauce': [], // dynamically filled
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  }
 
_(desireds).each(function(desired, key) {
  gruntConfig.env[key] = { 
    DESIRED: JSON.stringify(desired)
  }
  gruntConfig.concurrent['test-sauce'].push('test:sauce:' + key);
});

//console.log(gruntConfig);

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig(gruntConfig);

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint']);

  _(desireds).each(function(desired, key) {
      grunt.registerTask('test:sauce:' + key, ['env:' + key, 'simplemocha:sauce']);
  });

  grunt.registerTask('test:sauce:parallel', ['concurrent:test-sauce']);
};
