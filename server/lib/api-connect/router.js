'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./controller')

router.post('/api/connects', controller.create);

module.exports = router;