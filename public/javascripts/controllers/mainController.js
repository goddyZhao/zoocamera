if (app) {

  // MainController - outermost scope controller
  // In this controller, it manages transition animation
  // and common features
  app.controller('MainController', ['$scope', '$rootScope', '$http', '$timeout',
    function ($scope, $rootScope, $http, $timeout) {

      // Animation flags manager
      $scope.animations = {

        // Control animation when page or request is loading
        load: false,

        // Control animation when users login successfully
        login: false,

        // Control animation when popup dialogue is shown
        popup: false,

        // Control animation when notification need to popup
        notification: false
      };

      // Current zookeeper model, store ip address and port
      $scope.zookeeper = {
        host: '',
        port: ''
      };

      // Submit the login form
      $scope.submit = function () {
        var connectData = {
          host: $scope.zookeeper.host,
          port: $scope.zookeeper.port,
          _csrf: $rootScope.token
        };

        // Start loading
        $scope.animations.load = true;

        // Connect request
        $http({method: 'POST', url: '/api/connects', data: connectData})
          .success(function (res) {

            $scope.connectFailed = false;

            // Stop loading
            $scope.animations.load = false;

            // Connect successfully
            if (res.data && res.data.success) {

              // Notify children controller to load tree
              $timeout(function () {
                $scope.$broadcast('tree.fetch');
              }, 1000);

              // Host selection initialization
              $scope.zookeepers[0] = $scope.zookeeper;

              // Connect successfully and hide start page
              $scope.animations.login = true;
            }

            // Connect failed
            else {
              $scope.connectFailed = true;
            }
          })
          .error(function () {
            $scope.connectFailed = true;
          });
      };

      // Already connected, skip connect form
      if ($rootScope.isLogin) {
        $scope.animations.login = true;
        $scope.zookeeper.host = $rootScope.zookeeper.host;
        $scope.zookeeper.port = $rootScope.zookeeper.port;

        // Currently, we only support one connection
        $scope.zookeepers[0] = $scope.zookeeper;
      }

      // User disconnects host manually
      $scope.$on('disconnect', function () {

        // todo: Disconnect request here
        window.location = '/';
      });
    }
  ]);
}