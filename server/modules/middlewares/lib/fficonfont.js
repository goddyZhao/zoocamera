'use strict';

var path = require('path');

/**
 * Firefox will not render icon font unless the server
 * set the response header 'Access-Control-Allow-Origin' as '*'
 */
function fficonfont() {
  var fontTypeRegExp = /^\.(woff|eot|ttf|svg)$/;

  return function (req, res, next) {
    var extname = path.extname(req.path);
    if (fontTypeRegExp.test(extname)) {
      res.set('Access-Control-Allow-Origin', '*');
    }
    next();
  }
}

module.exports = fficonfont;