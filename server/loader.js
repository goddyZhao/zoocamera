'use strict';

var logger = require('./logger').create('loader');

var moduleDir = './lib/';

exports.load = function(app){
  // List all the modules name here
  var modulesName = [
    'index'
  ];

  // Require all the modules
  modulesName.forEach(function (moduleName) {
    logger.info('Start loading ' + moduleName);
    app.use(require(moduleDir + moduleName));
    logger.info('Finish loading ' + moduleName);
  });
};