'use strict';

function error500 (req, res) {
  res.status(500);
  res.render('500');
}

function unsupported (req, res) {
  res.render('unsupported');
}

exports.error500 = error500;
exports.unsupported = unsupported;