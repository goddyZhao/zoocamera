'use strict';
var connect = require('connect');
var hbs = require('hbs');
var i18n = require('i18next');
var url = require('url');
var middlewares = require('../../modules/middlewares');

/**
 * The configuration before the `env`
 * Which is applied before the configurations in dev/pro env
 */
function before (app, express, config) {
  // slow response
  // app.use(function (req, res, next) {
  //   setTimeout(function () {
  //     next();
  //   }, 5000);
  // });
  
  hbs.registerHelper('t', function (i18nKey) {
    var result = i18n.t(i18nKey);
    return new hbs.handlebars.SafeString(result);
  });

  app.use(middlewares.fficonfont());
  app.use(connect.compress());
  app.use(connect.urlencoded());

  var secretConfig = config.secret;
  app.use(connect.cookieParser(secretConfig.cookie));
}

/**
 * The configuration after the `env`
 * Which is applied after the configurations in dev/pro env
 */
function after (app, express, config) {
  app.use(function (req, res, next) {
    // Inject the static server information
    // res.locals.assetsServerHost = url.format(config.assetsServer);
    next();
  });
}

exports.before = before;
exports.after = after;