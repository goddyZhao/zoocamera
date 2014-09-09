'use strict'

var zk = require('../zk');
var logger = require('../../logger').create('api-connect');

function create (req, res) {
  var host = req.param('host');
  var port = req.param('port');
  var zookeeperServerUrl = host + ':' + port;

  zk.connect(zookeeperServerUrl)
  .then(function (client) {
    req.session.zookeeperServerUrl = zookeeperServerUrl;
    res.json({
      success: true,
      data: {
        success: true
      }
    });
    client.close();
  })
  .then(null, function (err) {
    logger.logAppError(err);
    res.json({
      success: false
    })
  });

}

exports.create = create;