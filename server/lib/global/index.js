'use strict';

var express = require('express');
var router = require('./router');
var app = module.exports = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(router);
app.use(function (req, res) {
  res.status(400);
  res.render('404');
});
app.use(function (err, req, res) {
  res.status(500);
  res.render('500');
})