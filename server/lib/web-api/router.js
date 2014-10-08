'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../../logger').create('web-api');

router.get('/test-api', function (req, res) {
  var data = new Object();
  if(req.query.host && req.query.port) {
  	data = {zkHost: req.query.host, zkPort: req.query.port};
  }
  res.render('test-api', data);
});

module.exports = router;