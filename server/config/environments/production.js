'use strict';

var connect = require('connect');
var connectRedis = require('connect-redis');
var session = require('express-session');
var path = require('path');
var url = require('url');
var env = require('../../../env');
var logger = require('../../logger').create();
var fatalErrorLogger = require('../../logger').create('fatalError');
var allConfig = require('./all');
var i18n = require('i18next');
var _ = require('lodash-node');

// Init i18n
var i18nOptions = {
  useCookie: false,
  lng: 'zh-CN' // TODO: remove it to support i18n in the future
};
var i18nOptionsForClient = _.clone(i18nOptions);
i18nOptionsForClient.dynamicLoad = true;
i18nOptionsForClient.resGetPath = '/locales/resources.json?lng=__lng__&ns=__ns__';
i18n.init(i18nOptions);

var timestamp = Date.now();

module.exports = function(app, express, config){
  // // Load the common `before` configuration
  // allConfig.before(app, express, config);

  // var secretConfig = config.secret;
  // var sessionConfig = config.session;
  // var cdnUrl = config.service.cdn.url;
  
  // var RedisStore = connectRedis(session);
  // app.use(session({
  //   name: sessionConfig.name,
  //   secret: secretConfig.session,
  //   store: new RedisStore(config.redis),
  //   cookie: {
  //     maxAge: sessionConfig.maxAge
  //   }
  // }));
  // // Inject the global variables 
  // app.use(function (req, res, next){
  //   res.locals.env = 'pdate20140814';
  //   res.locals.timestamp = timestamp;
  //   var configSite = config.site;
  //   res.locals.rootUrl = url.format({
  //     protocol: configSite.protocol,
  //     hostname: configSite.hostname
  //   }) + '/';

  //   next();
  // });

  // /**
  //  * We only support zh-CN in v1 and will enable i18n in the future
  //  */
  // // i18n
  // // app.use(i18n.handle);
  // app.use(function (req, res, next) {
  //   // i18nOptionsForClient.lng = req.locale;
  //   i18nOptionsForClient.lng = 'zh-CN';
  //   res.locals.i18nOptions = JSON.stringify(i18nOptionsForClient);
  //   next();
  // });

  // // Load the common `after` configuration
  // app.use(connect.methodOverride());
  // app.use(connect.csrf());
  // app.use(function (req, res, next) {
  //   // Inject the token into views
  //   res.locals.token = req.csrfToken();
  //   next();
  // });
  // allConfig.after(app, express, config);
  // i18n.serveDynamicResources(app);

  // connect.logger.format('pro', ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms < ":referrer" ":user-agent"');
  // app.use(connect.logger({ stream: logger, format: 'pro' }));
  // app.use(function (err, req, res, next) {
  //   if (err) {
  //     fatalErrorLogger.error('Request for ' + req.url);
  //     fatalErrorLogger.logAppError(err);
  //   }
  //   next();
  // });
  // app.use(connect.errorHandler());
};