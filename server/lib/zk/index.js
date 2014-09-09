'use strict';

var Q = require('q');
var zookeeper = require('node-zookeeper-client');
var logger = require('../../logger').create('zk');

function connect(zookeeperServerUrl) {
  var deferred = Q.defer();

  var client = zookeeper.createClient(zookeeperServerUrl);

  /**
   * It seems that the zookeeper has issue of connection failure
   * Tt does not emit events about the failure
   * So, we have to manually detech the timeout
   */
  var timer = setTimeout(function () {
    client.close();
    deferred.reject(new Error('timeout to connect zookeeper'));
  }, 30000);

  client.once('connected', function () {
    logger.info('Connected to ' + zookeeperServerUrl);
    clearTimeout(timer);
    deferred.resolve(client);
  });

  client.connect();

  return deferred.promise;
}

exports.connect = connect;