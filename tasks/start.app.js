'use strict';

module.exports = function (grunt) {
  grunt.registerTask('start.app', [
    'concurrent:dev'
  ]);
};