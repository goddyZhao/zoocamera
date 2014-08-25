// Main module
// Module and dependencies declaration
angular.module('zoopervisor', [
  'ngRoute',
  'ngAnimate',
  'ui.tree',
  'angular-intro',
  'zoopervisor.controller'])

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