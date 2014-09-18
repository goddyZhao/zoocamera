'use strict';

var connect = require('connect');
var path = require('path');
var url = require('url');
var env = require('../../../env');
var logger = require('../../logger').create();
var allConfig = require('./all');
var i18n = require('i18next');
var _ = require('lodash-node');


// Init i18n
var i18nOptions = {
  debug: true,
  useCookie: false,
  lng: 'zh-CN' // TODO: remove it to support i18n in the future
};
i18n.init(i18nOptions);

module.exports = function(app, express, config){
  // Load the common `before` configuration
  allConfig.before(app, express, config);


  var rootDir = env.getRootDir();
  app.use(express.static(path.join(rootDir, 'public')));

  var secretConfig = config.secret;

  app.use(connect.session({secret: secretConfig.session}));
  // Inject the global variables 
  app.use(function (req, res, next){
    res.locals.env = 'dev';
    // Generate the timestamp for every request to disable cache from browser
    res.locals.timestamp = new Date().getTime();
    res.locals.rootUrl = url.format(config.site) + '/';
    next();
  });

  /**
   * We only support zh-CN in v1 and will enable i18n in the future
   */
  // i18n
  // app.use(i18n.handle);
  var i18nOptionsForClient = _.clone(i18nOptions);
  i18nOptionsForClient.dynamicLoad = true;
  i18nOptionsForClient.resGetPath = '/locales/resources.json?lng=__lng__&ns=__ns__';
  app.use(function (req, res, next) {
    // i18nOptionsForClient.lng = req.locale;
    i18nOptionsForClient.lng = 'zh-CN';
    res.locals.i18nOptions = JSON.stringify(i18nOptionsForClient);
    next();
  });

  app.use(connect.logger({ stream: logger, format: 'dev'}));
  app.use(connect.errorHandler({ dumpException: true, showStack: true}));

  // Load the common `after` configuration
  app.use(connect.json());
  app.use(connect.methodOverride());
  app.use(connect.csrf());
  app.use(function (req, res, next) {
    // Inject the token into views
    res.locals.token = req.csrfToken();

    // Inject whether it is login
    if (req.session.zookeeperServerUrl) {
      res.locals.isLogin = 'yes';
      res.locals.zookeeperServerUrl = zookeeperServerUrl;
    } else {
      res.locals.isLogin = 'no'
    }
    next();
  });
  allConfig.after(app, express, config);

  i18n.serveDynamicResources(app);
};