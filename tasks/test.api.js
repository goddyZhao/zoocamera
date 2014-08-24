'use strict';

module.exports = function (grunt) {
  grunt.registerTask('test.api', [ 'clean:testLog','mochacli:api' ]);
};