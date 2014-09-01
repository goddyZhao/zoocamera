// Main module
// Module and dependencies declaration
var app = angular.module('zoopervisor', [
  'ngRoute',
  'ngAnimate',
  'ui.tree',
  'angular-intro',
  'ui.ace',
  'ui.select'])

  // Route configuration
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    'use strict';

    $routeProvider
      .when('/', {
        templateUrl: '/templates/app.html',
        controller: 'AppController'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }])

  // $rootScope initialization
  .run(function ($rootScope) {
    'use strict';

    $rootScope.site = '127.0.0.1';
  });