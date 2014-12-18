'use strict';

module.exports = {
  build: ['public/build'],
  dev: ['public/build/dev'],
  pro: ['public/assets/pdate*', 'public/build/pdate*'],
  testLog: ['log/test.log'],
  shrinkwrap: ['npm-shrinkwrap.json']
};