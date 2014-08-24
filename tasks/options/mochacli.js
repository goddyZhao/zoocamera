'use strict';

module.exports = {
  /**
   * Unit Tests of `modules` and `api`
   */
  options: {
    require: ['chai'],
    reporter: 'spec',
    ui: 'bdd',
    bail: true,
    env: {
      'NODE_ENV': 'test'
    }
  },

  modules: {
    src: ['server/lib/*/test/*.js']
  },

  api: {
    src: ['test/api/*.js']
  },

  apiDebug: {
    options: {
      env: {
        'NODE_ENV': 'test',
        'DEBUG': 1
      }
    },
    src: ['test/api/*.js']
  },

  cov: {
    options: {
      reporter: 'html-cov',
      env: {
        'CC_COV': 1,
        'NODE_ENV': 'test'
      }
    },

    src: ['test/api/*.js']
  },

  covDebug: {
    options: {
      env: {
        'CC_COV': 1,
        'NODE_ENV': 'test'
      }
    },

    src: ['test/api/*.js']
  }
};