'use strict';

var _ = require('lodash-node');

var config = {
  file: 'start.js',
  cwd: process.cwd(),
  watchedExtensions: ['js', 'json'],
  watchedFolders: ['server', 'config', 'db', 'locales'],
  nodeArgs: ['--debug']
};

module.exports = {
  dev: {
    options: _.extend({}, config)
  },

  test: {
    options: _.extend({
      env: {
        DEBUG: 1,
        NODE_ENV: 'test'
      }
    }, config)
  }
};