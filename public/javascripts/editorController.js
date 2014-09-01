if (app) {
  // EditorController - controller of file content editor
  // Firstly, calculate editor's height according to window's height
  // and we make it be responsive
  app.controller('EditorController', ['$scope', '$document', function ($scope, $document) {

    // To get the correct height of editor, we should get the height of the doms related
    // including window, navbar and editor container
    var getPanelHeight = function () {
      var windowHeight = window.innerHeight;
      var navbarHeight = $document[0].querySelector('.navbar').clientHeight;
      return windowHeight - navbarHeight;
    };

    $scope.language = {};
    $scope.languages = [
      'XML', 'Javascript', 'Python'
    ];

    $scope.mode = {};
    $scope.modes = [
      'Normal', 'VI', 'Emacs'
    ]

    // Start calculating until user selects a node
    $scope.$on('node.selected', function () {
      $scope.panelHeight = getPanelHeight();
    });

    // Makes editor be responsive
    window.onresize = function () {
      $scope.$apply();
    };

    $scope.$watch(function () {
      return angular.element(window)[0].innerHeight;
    }, function () {
      if ($scope.panelHeight) {
        $scope.panelHeight = getPanelHeight();
      }
    });
  }]);
}