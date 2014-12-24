'use strict';

module.exports = {
  bower: {
    files: {
      'public/build/javascripts/vendor.min.js': ['public/build/javascripts/vendor.js']
    }
  },

  app: {
    files: {
      'public/build/javascripts/app.min.js': ['public/javascripts/**/*.js']
    }
  }
};