// Main module
// Module and dependencies declaration
var app = angular.module('zoopervisor', [
  'ngRoute',
  'ngAnimate',
  'app.services',
  'ui.tree',
  'angular-intro',
  'ui.ace',
  'ui.select'])

  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    'use strict';

    // Route configuration
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
  .run(['$rootScope', '$document', function ($rootScope, $document) {
    'use strict';

    // Store zookeeper available
    $rootScope.zookeepers = [];

    // Interval of the toggling of notification, in ms
    $rootScope.notifcationInterval = 1500;

    // Get the token in meta tag
    $rootScope.token = $document[0]
      .querySelector('meta[name="csrf-token"]')
      .getAttribute('content');

    // Get the login status in meta tag and transfer to boolean type
    $rootScope.isLogin =
      $document[0]
        .querySelector('meta[name="isLogin"]')
        .getAttribute('content')
        .toLowerCase() === 'yes';

    // Get host and port of zookeeper in meta tag if exists
    if ($rootScope.isLogin) {
      var url = $document[0].querySelector('meta[name="zookeeperServerUrl"]')
        .getAttribute('content').split(':');

      $rootScope.zookeeper = {
        host: url[0],
        port: url[1]
      };
    }

    $rootScope.team = [
      {
        name: 'Goddy Zhao',
        duty: 'backend',
        avatar: 'https://avatars3.githubusercontent.com/u/164988',
        github: 'https://github.com/goddyZhao'
      },
      {
        name: 'Wright Liu',
        duty: 'backend',
        avatar: 'https://avatars3.githubusercontent.com/u/4536544',
        github: 'https://github.com/touwang'
      },
      {
        name: 'Jacob Zhang',
        duty: 'ui',
        avatar: 'https://avatars1.githubusercontent.com/u/1867889',
        github: 'https://github.com/judas1017'

      },
      {
        name: 'Lu, Ke',
        duty: 'ui',
        avatar: 'https://avatars2.githubusercontent.com/u/558673',
        github: 'https://github.com/lukeupup'
      }
    ]
  }]);