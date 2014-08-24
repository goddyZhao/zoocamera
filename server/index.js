var express = require("express");
var config = require("../config");
var loader = require("./loader");
var logger =require("./logger").create();

var app = express();
var server;
var appConfig;

/**
 * Set up the app environment
 * 
 * @param {String} env environment of the application
 * @param {Object} config 
 * @api private
 */
function _setup(env, config){
  require('./config/environments/' + env)(app, express, config);
  loader.load(app);
}


/**
 * Start the server in `env` mode
 * 
 * @param {String} env test | development | production
 * @api public
 */
function startServer(env){
  var port;

  appConfig = config[env];
  _setup(env, appConfig);
  
  port = appConfig.site.port;
  server = app.listen(port);

  var msg = 'Server is listening on port ' + port + ' in ' + env + ' mode';
  logger.info(msg);

  return server;
}

function stopServer(){
  if(typeof server !== "undefined"){
    server.close();
    logger.info("Server has been stopped");
  }
}

exports.startServer = startServer;
exports.stopServer = stopServer;
exports.app = app;
