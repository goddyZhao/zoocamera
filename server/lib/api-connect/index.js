'use strict';

var express = require('express');
var router = require('./router');
var app = module.exports = express();

app.use(router);

