'use strict';

var glob = require('glob');

function loadConfig(path){
  var config = {};

  glob.sync('*.js', {cwd: path}).forEach(function(option){
    var key = option.replace(/\.js/, '');
    config[key] = require(path + option);
  });

  return config;
}

module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);
  
  var config = {};
  var customConfig = loadConfig('./tasks/options/');

  grunt.util._.extend(config, customConfig);
  grunt.initConfig(config);
  grunt.loadTasks('tasks');
};