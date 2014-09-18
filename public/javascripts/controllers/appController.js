if (app) {

  // AppController - controller of the real web app
  // contains 3 sub-controller and manages their templates.
  // Also it listens the events from child controllers and play
  // the role as a bridge of communication among them
  app.controller('AppController', ['$scope', '$http', '$timeout', '$rootScope',
    function ($scope, $http, $timeout, $rootScope) {

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
        if (!node) {
          $scope.selectedNode = null;
        }
        else {
          if ($scope.selectedNode !== node.id) {
            $scope.selectedNode = node.id;

            var path = (node.path === '/' ? '' : node.path) + '/' + node.title
              , url = '/api/nodes/' + encodeURIComponent(path);

            $http({method: 'GET', url: url})
              .success(function (res) {

                if (res.success && res.data)
                // Response to NodeController
                  $scope.$broadcast('node.selected', res.data);
              })
              .error(function () {

              });
          }
        }
      });

      // Listener for 'node.creating' event from NodeController
      // and fire a request to create a new node in zookeeper node tree
      $scope.$on('node.creating', function (event, msg) {
        var postData = {path: msg.path, _csrf: $rootScope.token};
        $scope.closePopup();

        $http({method: 'POST', url: '/api/nodes', data: postData})
          .success(function (res) {

            if (res.success && res.data) {
              showNotification({type: 'success', content: 'Test'});

              $scope.$broadcast('node.created', {
                scope: msg.scope,
                node: {
                  id: res.data.node.id,
                  title: msg.name,
                  path: msg.path.slice(0, msg.path.lastIndexOf('/'))
                }
              });
            }
            else {
              showNotification({type: 'failure', content: 'Test'});
            }
          })
          .error(function () {
            showNotification({type: 'failure', content: 'Test'});
          });
      });

      // Listen to node.deleting event from NodeController
      // for requesting to delete specific node in the tree
      $scope.$on('node.removing', function (event, msg) {
        var url = '/api/nodes/' + encodeURIComponent(msg.path);
        $scope.closePopup();

        $http({method: 'POST', url: url, data: {_method: 'delete', _csrf: $rootScope.token}})
          .success(function (res) {

            if (res.success) {
              showNotification({type: 'success', content: 'Test'});
              $scope.$broadcast('node.removed', {scope: msg.scope});
            }
            else {
              showNotification({type: 'failure', content: 'Test'});
            }
          })
          .error(function () {
            showNotification({type: 'failure', content: 'Test'});
          });
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