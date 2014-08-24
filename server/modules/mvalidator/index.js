'use strict';

var validator = require('../validator');
var _ = require('lodash-node');

function getValidator (validateName, options) {
  var validateFunc;
  if (_.isPlainObject(validateName)) {
    options = validateName;
    validateFunc = options.validate;
  } else {
    options = options || {};
    validateFunc = validator[validateName];
  }
  var args = options.args || [];
  if (validateFunc) {
    return {
      validator: function (val) {
        if (options.passIfEmpty && (val === undefined || val === null)) {
          return true;
        }

        args.unshift(val);
        return validateFunc.apply(null, args);
      },
      msg: options.message
    };
  }

  throw new Error('Method ' +  validateName + ' does not exist on Validator.');
}

var mvalidator = {
  getValidator: getValidator,

  email: [ 
    getValidator('isEmail', { 
      message: 'Invalid email',
      passIfEmpty: true
    }) 
  ],
  url: [ 
    getValidator('isURL', { 
      message: 'Invalid URL',
      passIfEmpty: true
    })
  ],

  isAlphanumeric: [
    getValidator('isAlphanumeric', {
      message: 'Invalid alphanumeric',
      passIfEmpty: true
    })
  ]
};

module.exports = mvalidator;