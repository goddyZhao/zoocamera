'use strict';

module.exports = {
  bower: {
    files: ['public/bower_components/**/*'],
    tasks: ['bower_concat', 'uglify:bower', 'cssmin:bower']
  },

  script: {
    files: ['public/javascripts/**/*.js'],
    tasks: ['uglify:app']
  },

  css: {
    files: ['public/stylesheets/**/*.css'],
    tasks: ['cssmin:app']
  },

  image: {
    files: ['public/images/**/*'],
    tasks: ['copy:image']
  },

  font: {
    files: ['public/fonts/**/*'],
    tasks: ['copy:font']
  },

  livereload: {
    options: {livereload: true},
    files: ['public/build/**/*', 'public/templates/*']
  }
};