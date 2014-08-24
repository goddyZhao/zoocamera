'use strict';

var sanitizer = require('sanitizer');

function escapeXSS(val){
  if(typeof val !== 'string'){
    val = '';
  }

  return sanitizer.sanitize(val);
}

exports.escapeXSS = escapeXSS;