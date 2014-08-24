'use strict';

var express = require('express');
var controller = require('./controller');

var router = express.Router();
router.get('/error/500', controller.error500);
router.get('/error/unsupported', controller.unsupported);

module.exports = router;