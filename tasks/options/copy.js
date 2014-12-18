'use strict';

module.exports = {
  build: {
    files: [
      {
        expand: true,
        cwd: 'public',
        src: ['fonts/**/*'],
        dest: 'public/build'
      },
      {
        expand: true,
        cwd: 'public',
        src: ['images/**/*'],
        dest: 'public/build'
      },
      {
        expand: true,
        cwd: 'public/bower_components',
        src: ['ace-builds/src-min-noconflict/**/*'],
        dest: 'public/build/javascripts'
      },
      {
        expand: true,
        cwd: 'public/stylesheets',
        src: ['fontello/**/*'],
        dest: 'public/build/stylesheets'
      }
    ]
  }
};