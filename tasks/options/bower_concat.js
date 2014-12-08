'use strict';

module.exports = {
  all: {
    dest: 'public/build/_bower.js',
    cssDest: 'public/build/_bower.css',
    exclude: [
      'ace-builds',
      'es5-shim'
    ],

    bowerOptions: {
      relative: false
    }
  }
};