if (app) {

  // AppController - controller of the real web app
  // contains 3 sub-controller and manages their templates.
  // Also it listens the events from child controllers and play
  // the role as a bridge of communication among them
  app.controller('AppController', ['$scope', '$http', '$timeout', '$rootScope', function ($scope, $http, $timeout, $rootScope) {

    // Popup dialogue model
    $scope.popup = {};

    // Notification model
    $scope.notification = {
      content: '',
      type: ''
    };

    // Templates management
    $scope.templates = {
      node: '/templates/node.html',
      editor: '/templates/editor.html'
    };

    // Introduction setup
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

    // Handler of clicking disconnect button
    $scope.disconnect = function () {
      $scope.$emit('disconnect');
    };

    $scope.showTeam = function () {
      $scope.$emit('popup', {
        header: 'Hello team',
        template: '/templates/team.html',
        data: {
          team: $rootScope.team
        }
      });
    };

    // If a popup is requested, a 'popup' event will be emitted from children controller,
    // here is the listener. The properties of the popup are transferred in the event.
    $scope.$on('popup', function (event, popup) {

      // Apply popup properties
      $scope.popup = popup;

      // Show popup
      $scope.animations.popup = true;
    });

    // Listener for 'node.selected' event from NodeController
    // and change the model 'selectedNode' to the node in event
    $scope.$on('node.selecting', function (event, node) {

      // If the node selecting is already selected,
      // no action for this condition
      if ($scope.selected !== node) {
        $scope.selectedNode = node;

        if (node) {

          // Response to NodeController
          $scope.$broadcast('node.selected', node);
        }
      }
    });

    // Listener for 'node.creating' event from NodeController
    // and fire a request to create a new node in zookeeper node tree
    $scope.$on('node.creating', function (event, scope) {
      $scope.closePopup();
      showNotification({type: 'success', content: 'Test'});

      // todo: send the create request to server side and send back the result
      //$scope.$broadcast('node.created', {});
    });

    // Listen to node.deleting event from NodeController
    // for requesting to delete specific node in the tree
    $scope.$on('node.removing', function (event, scope) {
      $scope.closePopup();
      showNotification({type: 'failure', content: 'Test'});

      // todo: send the delete request to server side and send back the result
      //$scope.$broadcast('node.removed', {});
    });

    // Close popup, including hiding and cleaning
    $scope.closePopup = function () {
      $scope.animations.popup = false;
      $scope.popup = {};
    };

    var showNotification = function (notification) {
      $scope.animations.notification = true;

      $scope.notification.type = notification.type;
      $scope.notification.content = notification.content;

      $timeout(function () {
        $scope.animations.notification = false;
      }, $rootScope.notifcationInterval);
    };
  }]);
}