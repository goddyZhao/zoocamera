'use strict';

module.exports = {
  dev: {
    tasks: [
      'build.app',
      'nodemon:dev',
      'watch'
    ],
    options: {
      logConcurrentOutput: true
    }
  },

  test: {
    tasks: ['nodemon:test'],
    options: {
      logConcurrentOutput: true
    }
  }
};