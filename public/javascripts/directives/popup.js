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

      }
    };
  });
}