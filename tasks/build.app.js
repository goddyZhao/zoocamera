'use strict';

module.exports = function (grunt) {
  grunt.registerTask('build.app', [
    'clean:build',
    'copy',
    'bower_concat',
    'cssmin',
    'uglify'
  ]);
};