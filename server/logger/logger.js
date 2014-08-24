'use strict';

var winston = require('winston');
var util = require('util');
var env = require('../../env');

var appEnv = env.getEnv();
var isCov = env.isCov();
var isDebug = env.isDebug();

var transports;
var fatalErrorTransports;
switch(appEnv){
  case 'production':
    transports = [
      new (winston.transports.DailyRotateFile)({
        filename: 'log/pro.log',
        maxsize: 1024 * 1024 * 20,
        maxFiles: 100
      })
    ];

    fatalErrorTransports = [
      new (winston.transports.DailyRotateFile)({
        filename: 'log/pro-error.log',
        maxsize: 1024 * 1024 * 20,
        maxFiles: 100
      })
    ];
    break;

  case 'staging':
    transports = [
      new (winston.transports.DailyRotateFile)({
        filename: 'log/staging.log',
        maxsize: 1024 * 1024 * 4
      })
    ];

    fatalErrorTransports = [
      new (winston.transports.DailyRotateFile)({
        filename: 'log/staging-error.log',
        maxsize: 1024 * 1024 * 4
      })
    ]
    break;

  case 'development':
    transports = [
      new (winston.transports.Console)({
        colorize: true
      })
    ];

    fatalErrorTransports = [
      new (winston.transports.Console)({
        colorize: true
      })
    ];
    break;
  case 'test':

    if(isCov || !isDebug){
      transports = [
        new (winston.transports.File)({
          filename: 'log/test.log'
        })
      ];

      fatalErrorTransports = [
        new (winston.transports.File)({
          filename: 'log/test-error.log'
        })
      ];
    }else{
      transports = [
        new (winston.transports.Console)({
          colorize: true
        })
      ];

      fatalErrorTransports = [
        new (winston.transports.Console)({
          colorize: true
        })
      ];
    }

    break;
}

var singletonLogger = new winston.Logger({
  transports: transports
});

var singletonFatalErrorLogger = new winston.Logger({
  transports: fatalErrorTransports
});

/**
 * Logger 
 */
function Logger(moduleName, options){
  var moduleName = moduleName || 'app';
  this.setModuleName(moduleName);
  if (moduleName === 'fatalError') {
    this._logger = singletonFatalErrorLogger;
  } else {
    this._logger = singletonLogger;
  }
}

// Define write to make it easy as a writable stream
Logger.prototype.write = function(){
  this.info.apply(this, arguments);
};

Logger.prototype.getMsg = function (msg) {
  return '[' + this.moduleName + '] - ' + msg;
};

Logger.prototype.info = function (msg) {
  this._logger.info(this.getMsg(msg));
};

Logger.prototype.error = function (msg) {
  this._logger.error(this.getMsg(msg));
};

Logger.prototype.warn = function (msg) {
  this._logger.warn(this.getMsg(msg));
};

Logger.prototype.logAppError = function (err) {
  var self = this;
  if (err.errors) { // Mongoose validation error
    Object.keys(err.errors).forEach(function (field) {
      self.error(err.errors[field].message);
    });
  }
  this.error(err.message);
  this.error(err.stack);
};

Logger.prototype.setModuleName = function (moduleName) {
  this.moduleName = moduleName || '';
};

var loggers = {};

function create(moduleName) {
  moduleName = moduleName || 'app';
  var logger = loggers[moduleName];
  if (!logger) {
    logger = new Logger(moduleName);
    loggers[moduleName] = logger;
  }

  return logger;
}

exports.create = create;