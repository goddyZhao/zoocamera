if (app) {
  app.controller('SiteController', ['$scope', '$rootScope', '$cookieStore', function ($scope, $rootScope, $cookieStore) {

    $scope.toggleSiteSidebar = function () {
      $rootScope.siteCollapsed = !$rootScope.siteCollapsed;
    };

    $scope.disconnect = function (event) {
      event.stopPropagation();
      $cookieStore.remove('connected');
      window.location = '/';
    };
  }]);
}