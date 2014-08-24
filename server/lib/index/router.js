'use strict';
var express = require('express');
var clientRoutes = require('./client-routes');
var logger = require('../../logger').create('index');

var handler = function (req, res) {
  res.render('index');  
}

var router = express.Router();

/**
 * Below is all the router defined in client
 */
router.get('/', handler);
clientRoutes.forEach(function (routePath) {
  router.get(routePath, handler);
});

module.exports = router;