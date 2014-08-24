'use strict';

var fatalErrorLogger = require('./server/logger').create('fatalError');
var app = require('./app');

process.on('uncaughtException', function (err) {
  fatalErrorLogger.error('uncaught exception');
  fatalErrorLogger.logAppError(err);
  process.exit(1);
});

app.startApp(function (err) {
  if (err) {
    fatalErrorLogger.logAppError(err);
    process.exit(1);
  }
});

