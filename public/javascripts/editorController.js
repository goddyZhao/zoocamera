if (app) {

  // EditorController - controller of file content editor
  // Firstly, calculate editor's height according to window's height
  // and we make it be responsive
  app.controller('EditorController', ['$scope', '$document', function ($scope, $document) {

    // To get the correct height of editor, we should get the height of the doms related
    // including window, navbar and editor container
    var getEditorHeight = function () {
      var windowHeight = window.innerHeight;
      var navbarHeight = $document[0].querySelector('.navbar').clientHeight;

      var containerStyle = getComputedStyle($document[0].querySelector('.main'));
      var containerPadding =
        parseInt(containerStyle.getPropertyValue('padding-top')) +
        parseInt(containerStyle.getPropertyValue('padding-bottom'));

      return windowHeight - navbarHeight - containerPadding - 105;
    };

    // Start calculating until user selects a node
    $scope.$on('node.selected', function () {

      if (!$scope.height) {
        $scope.height = getEditorHeight();
      }
    });

    // Makes editor be responsive
    window.onresize = function () {
      $scope.$apply();
    };

    $scope.$watch(function () {
      return angular.element(window)[0].innerHeight;
    }, function () {
      if ($scope.height) {
        $scope.height = getEditorHeight();
      }
    });
  }]);
}