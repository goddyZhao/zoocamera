if (app) {

  // MainController - outermost scope controller
  // In this controller, it manages transition animation
  // and common features
  app.controller('MainController', ['$scope', '$timeout', function ($scope, $timeout) {

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
      ip: '1',
      port: '1'
    };

    // Submit the login form
    $scope.submit = function () {

      // Display loading icon
      $scope.animations.load = true;

      // todo: Start connecting zookeeper
      $timeout(function () {

        // Connect successfully
        $scope.$broadcast('node.load');
        $scope.animations.load = false;
        $scope.animations.login = true;
      }, 0);
    };
  }]);
}