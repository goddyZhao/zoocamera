'use strict';

var express = require('express');
var router = require('./router');
var app = module.exports = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(router);

