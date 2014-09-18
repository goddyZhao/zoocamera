'use strict'

var Q = require('q');
var uuid = require('node-uuid');
var zk = require('../zk');
var logger = require('../../logger').create('api-node');

function getPath (path, newNode) {
  var retPath = path;
  if (newNode) {
    retPath += '/' + newNode;
  }

  return retPath.replace('//', '/');
}

function getChildren (client, path) {
  var deferred = Q.defer();

  Q.ninvoke(client, 'getChildren', path)
  .spread(function (children) {
    var childrenObjs = [];
    var promiseArr = [];

    children.forEach(function (nodePath) {
      var child = {
        id: uuid.v4(),
        title: nodePath
      }

      childrenObjs.push(child);
      var isRoot = path === '/';
      var nextPath = isRoot ? (path + nodePath) : (path + '/' + nodePath);
      var getChildrenPromise = getChildren(client, nextPath);
      promiseArr.push(getChildrenPromise);
    });

    Q.all(promiseArr)
    .then(function (childrenArr) {
      for (var i = 0, l = childrenArr.length; i < l; i++) {
        childrenObjs[i].items = childrenArr[i];
      }

      deferred.resolve(childrenObjs);
    })
  })
  .then(null, deferred.reject);

  return deferred.promise;
}

function index (req, res) {
  var zookeeperServerUrl = req.session.zookeeperServerUrl;
  var path = req.param('path') || '/';

  zk.connect(zookeeperServerUrl)
  .then(function (client) {
    logger.info('Start get the all the children of ' + path);
    return getChildren(client, path);
  })
  .then(function (children) {
    logger.info('Got all the children of ' + path);
    res.json({
      success: true,
      data: {
        nodes: children
      }
    });
  })
  .then(null, function (err) {
    logger.logAppError(err);
    res.json({
      success: false
    })
  });
}

function create (req, res) {
  var newPath = req.param('path');

  var zookeeperServerUrl = req.session.zookeeperServerUrl;

  zk.connect(zookeeperServerUrl)
  .then(function (client) {
    logger.info('Start creating node with path(' + newPath + ')');
    return Q.ninvoke(client, 'create', newPath);
  })
  .then(function () {
    logger.info('Created node with path(' + newPath + ')');
    res.json({
      success: true
    });
  })
  .then(null, function (err) {
    logger.error('Failed to create node with path(' + newPath + ')');
    logger.logAppError(err);
    res.json({
      success: false
    });
  });
}

exports.create = create;
exports.index = index;