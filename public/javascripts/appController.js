if (app) {

  // AppController - controller of the real web app
  // contains 3 sub-controller and manages their templates.
  // Also it listens the events from child controllers and play
  // the role as a bridge of communication among them
  app.controller('AppController', ['$scope', '$http', function ($scope, $http) {

    // Templates management
    $scope.templates = {
      site: '/templates/site.html',
      node: '/templates/node.html',
      editor: '/templates/editor.html',
      popup: ''
    };

    $scope.introOptions = {
      steps: [
        {
          element: '#navbar',
          intro: "First tooltip",
          position: 'bottom'
        },
        {
          element: '#site',
          intro: "Second tooltip",
          position: 'right'
        },
        {
          element: '#search',
          intro: "Second tooltip",
          position: 'bottom'
        },
        {
          element: '#tree-root',
          intro: "Second tooltip",
          position: 'right'
        },
        {
          element: '#editor',
          intro: "Second tooltip",
          position: 'left'
        }
      ],
      showStepNumbers: false,
      exitOnOverlayClick: true,
      exitOnEsc: true,
      nextLabel: '<strong>NEXT!</strong>',
      prevLabel: '<span style="color:green">Previous</span>',
      skipLabel: 'Exit',
      doneLabel: 'Thanks'
    };

    // Listen to node.selected event from NodeController
    // and change the model selectedNode with message in event
    $scope.$on('node.selecting', function (event, node) {
      if ($scope.selected !== node) {
        $scope.selectedNode = node;

        if (node) {
          $scope.$broadcast('node.selected', node);
        }
      }
    });

    // Listen to node.creating event from NodeController
    // for requesting to create a new node in the tree
    $scope.$on('node.creating', function (event, scope) {
      $scope.animations.popup = true;
      $scope.templates.popup = '/templates/nodeAddDialogue.html';

      //// todo: send the create request to server side and send back the result
      //$scope.$broadcast('node.created', {});
    });

    // Listen to node.deleting event from NodeController
    // for requesting to delete specific node in the tree
    $scope.$on('node.removing', function (event, scope) {
      $scope.animations.popup = true;
      $scope.templates.popup = '/templates/removeConfirm.html';

      //// todo: send the delete request to server side and send back the result
      //$scope.$broadcast('node.removed', {});
    });

    $scope.closePopup = function () {
      $scope.animations.popup = false;
      $scope.templates.popup = '';
    };
  }]);
}