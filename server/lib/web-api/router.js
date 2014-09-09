'use strict';

var express = require('express');
var router = express.Router();

router.get('/test-api', function (req, res) {
  res.render('test-api');
});

module.exports = router;