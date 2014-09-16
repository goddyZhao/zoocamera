if (app) {
  app.directive('zooPopup', function () {
    return {
      restrict: 'EA',
      scope: {
        popup: '=popup',
        close: '&onClose'
      },
      templateUrl: '/templates/popup.html',
      link: function (scope) {
        scope.$watch('popup', function () {

          var data = scope.popup.data;

          if (data) {
            angular.forEach(data, function (v, k) {
              scope[k] = v;
            });
          }
        });


        scope.model = {};
      }
    };
  });
}