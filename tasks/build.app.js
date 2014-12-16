'use strict';

module.exports = function (grunt) {
  grunt.registerTask('build.app', [
    'bower_concat',
    'uglify:bower'
  ]);
};