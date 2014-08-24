var mongoose = require('mongoose');
var logger = require("../server/logger").create('db');

function generateMongoUrl(mongoObj){
  var mongoUrl;
  if(mongoObj.username && mongoObj.password){
    mongoUrl = [
      'mongodb://',
      mongoObj.username,
      ':',
      mongoObj.password,
      '@',
      mongoObj.hostname,
      ':',
      mongoObj.port,
      '/',
      mongoObj.db
    ].join('');
  }else{
    mongoUrl = [
      'mongodb://',
      mongoObj.hostname,
      ':',
      mongoObj.port,
      '/',
      mongoObj.db
    ].join('');
  }

  return mongoUrl;
};

function connect(db, cb){
  var dbUrl = generateMongoUrl(db);
  mongoose.connect(dbUrl, function(err){
    if(err){
      logger.error('Failed to connect ' + dbUrl + ' : ' + err.message);
      return cb(err);
    }
    logger.info('Connected to db - ' + dbUrl);
    cb(null);
  });
};

function disconnect(cb){
  mongoose.disconnect(cb);
}

exports.connect = connect;
exports.disconnect = disconnect;
