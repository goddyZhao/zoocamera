'use strict';

module.exports = {
  font: {
    files: [
      {
        expand: true,
        cwd: 'public',
        src: ['fonts/**/*'],
        dest: 'public/build'
      }
    ]
  },

  image: {
    files: [{
      expand: true,
      cwd: 'public',
      src: ['images/**/*'],
      dest: 'public/build'
    }]
  },

  ace: {
    files: [{
      expand: true,
      cwd: 'public/bower_components',
      src: ['ace-builds/src-min-noconflict/**/*'],
      dest: 'public/build/javascripts'
    }]
  }
};