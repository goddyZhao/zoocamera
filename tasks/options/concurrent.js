'use strict';

module.exports = {
  dev: {
    tasks: ['nodemon:dev', 'node-inspector'],
    options: {
      logConcurrentOutput: true
    }
  },

  test: {
    tasks: ['nodemon:test', 'node-inspector'],
    options: {
      logConcurrentOutput: true
    }
  }
};