'use strict';

module.exports = {
  dev: {
    tasks: ['nodemon:dev'],
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