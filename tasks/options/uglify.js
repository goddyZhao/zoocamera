'use strict';

module.exports = {
  target: {
    files: {
      'public/build/javascripts/app.min.js': ['public/javascripts/**/*.js'],
      'public/build/javascripts/vendor.min.js': ['public/build/javascripts/vendor.js']
    }
  }
};