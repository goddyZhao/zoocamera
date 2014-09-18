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

router.get('/api/nodes', isLogin, controller.index);
router.post('/api/nodes', isLogin, controller.create);
router.delete('/api/nodes/:nodePath', isLogin, controller.remove);
router.put('/api/nodes/:nodePath', isLogin, controller.update);

module.exports = router;