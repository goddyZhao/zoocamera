'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./controller');

function isLogin (req, res, next) {
  if (!req.session.zookeeperServerUrl) {
    res.json({
      success: false,
      error: 'notLogin'
    });
    return;
  }

  next();
}

router.get('/api/zk/connections', isLogin, controller.connections);

module.exports = router;