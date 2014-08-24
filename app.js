/**
 * Module dependencies
 */
var env = require("./env");
var config = require("./config");
var db = require('./db')
var logger = require("./server/logger").create();
var server = process.env.CC_COV 
  ? require("./server-cov") 
  : require("./server");

// Find the config according to the environment the app run in
env = env.getEnv();
config = config[env];

/**
 * Start the application by
 * 
 * 1. Connecting to database
 * 2. Starting the server
 */
function startApp(cb){
  // db.connect(config.db, function(err){
    // if(err){
    //   logger.error("Application fails to start!");
    //   return cb(err);
    // }

    server.startServer(env);

    logger.info("Application started!");
    cb(null);
  // });
};


/**
 * Stop the application by
 * 
 * 1. Disconnecting the database
 * 2. Stopping the server
 */
function stopApp(cb){
  server.stopServer();
  db.disconnect();

  logger.info("Application is stopped!");
  cb(null);
};

exports.startApp = startApp;
exports.stopApp = stopApp;