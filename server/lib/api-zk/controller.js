'use strict'

var Q = require('q');
var Buffer = require('buffer').Buffer;
var uuid = require('node-uuid');
var zk = require('../zk');
var util = require('util');
var logger = require('../../logger').create('api-zk');
var exec = require('child_process').exec;

function connections (req, res) {
  var zookeeperServerUrl = req.session.zookeeperServerUrl;
  var addressArr = zookeeperServerUrl.split(":");
  var child = exec("echo cons | nc " + addressArr[0] + " " + addressArr[1], function (error, stdout, stderr) {
    // logger.info('stdout: ' + stdout);
    // logger.info('stderr: ' + stderr);
    var regex = new RegExp(/^\/(.*):(\d*)\[\d*\]\((.*)\)$/);
    var lines = stdout.split("\n");
    var result = new Object();
    for (var i = lines.length - 1; i >= 0; i--) {
      if(lines[i].trim()) {
        logger.info(lines[i]);
        var connArray = regex.exec(lines[i].trim());
        if(!result[connArray[1]]) {
          result[connArray[1]] = new Array();
        }
        result[connArray[1]].push({"port":connArray[2],"param":connArray[3]});
        // for (var i = connArray.length - 1; i >= 0; i--) {
        //   logger.info(connArray[i]); 
        // };
      }
    };
    if (error !== null) {
      logger.info('exec error: ' + error);
    }
    res.json({
      success: true,
      data : result
    });
  });
}

exports.connections = connections;
