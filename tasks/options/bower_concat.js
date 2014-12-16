'use strict';

module.exports = {
  all: {
    dest: 'public/build/javascripts/vendor.js',
    cssDest: 'public/build/stylesheets/vendor.css',
    exclude: [
      'ace-builds',
      'es5-shim'
    ],

    bowerOptions: {
      relative: false
    }
  }
};