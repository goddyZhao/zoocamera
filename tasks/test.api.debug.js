'use strict';

module.exports = function (grunt) {
  grunt.registerTask('test.api.debug', ['mochacli:apiDebug']);
};