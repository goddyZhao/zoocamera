var url  =require('url');
var Q = require('q');
var request = require('supertest');
var chance = require('chance').Chance();
var MongoClient = require('mongodb').MongoClient;
var app = require("../../app");
var isCov = process.env.CC_COV;
var isDebug = process.env.DEBUG;
var config = require('../../config').test;
var dbConfig = config.db;
var siteUrl = url.format(config.site);

request = request(siteUrl);

var dbUrl = [
  'mongodb://', dbConfig.hostname, ':', dbConfig.port, '/', dbConfig.db 
].join('');

var DBUtil = {
  connect: function(url, cb){
    MongoClient.connect(url, cb);
  },

  disconnect: function(db, cb){
    db.close(cb);
  },

  /**
   * Clear the whole database
   * 
   * @param {Object} db the database instance
   * @param {String} collectionName the name of the collection
   */
  clearCollection: function(db, collectionName) {
    var collection = db.collection(collectionName);

    return Q.ninvoke(collection, 'remove');
  },

  clearCollections: function (db, collectionNames) {
    var promiseArr = [];
    collectionNames.forEach(function (collectionName) {
      promiseArr.push(DBUtil.clearCollection(db, collectionName));
    });

    return Q.all(promiseArr);
  },

  /**
   * Create data by collection name
   * 
   * @param {Object} db the instance of connected database
   * @param {String} collectionName the name of the collection
   * @param {Array} data an array contains all the data to be created
   * @param {Function} cb
   */
  createDataByCollection: function(db, collectionName, data){
    var collection = db.collection(collectionName);
    return Q.ninvoke(collection, 'insert', data);
  }
}; 

var TestUtil = {
  before: function(cb){
    DBUtil.connect(dbUrl, function(err, connectedDb){
      if(err){
        return cb(err);
      }
      if(isCov || !isDebug){
        app.startApp(function(err){
          if(err){
            return cb(err);
          }

          cb(null, connectedDb);
        })
      }else{
        cb(null, connectedDb);
      }
    });
  },

  after: function(db, cb){
    DBUtil.disconnect(db, function(err){
      if(err){
        return cb(err);
      }
      if(isCov || !isDebug){
        app.stopApp(cb);
      }else{
        cb(null);
      }
    })
  },

  getRandomMockUser: function () {
    return {
      githubId: chance.string({ length: 5 }),
      email: chance.email(),
      name: chance.name()
    };
  },

  getRandomUrl: function () {
    return 'http://' + chance.domain() + '/' + chance.string();
  },

  getRandomId: function () {
    return chance.hash( {length: 24} );
  },

  mockLoginUser: function (db, mockUser) {
    var mockUser = mockUser || TestUtil.getRandomMockUser();

    return DBUtil.createDataByCollection(db, 'users', [mockUser])
    .then(function (docs){
      var mockUserRet = docs[0];
      mockUserRet.id = mockUserRet._id.toString();
      return Q.fcall(function () {
        return mockUserRet;
      });
    });
  },

  expect: function (options) {
    var requestMethod = options.method || 'get';
    var statusCode = options.statusCode || 200;
    var needLoginUser = options.needLoginUser || false;
    var isSuccess = options.isSuccess || false;
    var data = options.data || null;

    var r = request[requestMethod](options.url).send(data);
    if (needLoginUser) {
      r = r.set('x-mock-session', 'true')
           .set('x-mock-user', JSON.stringify(options.loginUser));
    }

    r = r.expect('Content-Type', /json/)
         .expect(statusCode);

    var promise = Q.ninvoke(r, 'end')
    .then(function (res) {
      res.body.should.be.an('object');
      res.body.success.should.equal(isSuccess);
      if (!isSuccess) {
        res.body.should.include.keys('error');
      }

      return res;
    });

    return promise;
  },

  expectFailWithLoginUser: function (options) {
    options.isSuccess = false;
    options.needLoginUser = true;
    return TestUtil.expect(options);
  },

  expectSuccessWithLoginUser: function (options) {
    options.isSuccess = true;
    options.needLoginUser = true;
    return TestUtil.expect(options);
  },

  expectFailWithoutLoginUser: function (options) {
    options.isSuccess = false;
    options.needLoginUser = false;
    return TestUtil.expect(options);
  },

  expectSuccessWithoutLoginUser: function (options) {
    options.isSuccess = true;
    options.needLoginUser = false;
    return TestUtil.expect(options);
  }

};

exports.db = DBUtil;
exports.test = TestUtil;