if (app) {

  // MainController - outermost scope controller
  // In this controller, it manages transition animation
  // and common features
  app.controller('MainController', ['$scope', '$rootScope', '$http',
    function ($scope, $rootScope, $http) {

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

      // Zookeeper object, store ip address and port
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

        // Display loading icon
        $scope.animations.load = true;

        $http({method: 'POST', url: '/api/connects', data: connectData})
          .success(function (res) {
            $scope.animations.load = false;

            // Connect successfully
            if (res.data && res.data.success) {

              // Connect successfully
              $scope.animations.login = true;
            }

            // Connect failed
            else {

            }
          })
          .error(function (data) {
          });
      };

      // Check connected zookeeper in cookie
      var connected = false;

      // User first open app or has disconnected all zookeeper
      // Skip connect form
      if (connected) {
        $scope.animations.login = true;
        $scope.zookeeper = connected;
      }

      // Currently, we only support one connection
      $scope.zookeepers[0] = $scope.zookeeper;

      $scope.$on('disconnect', function () {

        // todo: Disconnect request here
        window.location = '/';
      });
    }
  ]);
}