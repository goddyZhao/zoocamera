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

      // todo: Introduction setup
      $scope.introOptions = {
        steps: [
          {
            element: '#intro-connect',
            intro: "Here shows what zookeeper are connected now, and you can disconnect manually.",
            position: 'bottom'
          },
          {
            element: '#intro-nav-toolbar',
            intro: "Navigator here, contains some useful functionalities. Click them to show more afterwards.",
            position: 'bottom'
          },
          {
            element: '#tree-root',
            intro: "Tree structure of the nodes in current zookeeper.",
            position: 'right'
          },
          {
            element: '#search',
            intro: "Search bar, you can find the nodes you want here.",
            position: 'right'
          },
          {
            element: document.querySelector('.angular-ui-tree-handle'),
            intro: "Second tooltip",
            position: 'right'
          },
          {
            element: document.querySelector('.editor-container'),
            intro: '',
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
        $scope.closePopup();

        // If the node selecting is already selected,
        // no action for this condition
        if (!node) {
          $scope.selectedNode = null;
        }
        else {

          // Select a different node, change the selectedNode model
          // and request for the content of this node
          if ($scope.selectedNode !== node.id) {

            if ($scope.isEditing) {
              $scope.$broadcast('node.content.unsaved', node);
            }
            else {

              // Construct request url
              var path = (node.path === '/' ? '' : node.path) + '/' + node.title
                , url = '/api/nodes/' + encodeURIComponent(path);

              $http({method: 'GET', url: url})
                .success(function (res) {

                  // Got content and response to NodeController
                  if (res.success && res.data) {
                    $scope.selectedNode = node.id;
                    $scope.$broadcast('node.selected', {node: node, data: res.data});
                  }
                  else {
                    $scope.selectedNode = null;
                    notiFactory({type: 'failure', content: 'Cannot get node content!'});
                  }
                })
                .error(function () {
                  $scope.selectedNode = null;
                  notiFactory({type: 'failure', content: 'Cannot get node content!'});
                });
            }
          }
        }
      });

      // Listener for 'node.creating' event from NodeController
      // and fire a request to create a new node in zookeeper node tree
      $scope.$on('node.creating', function (event, msg) {

        // Construct post data
        var postData = {path: msg.path, _csrf: $rootScope.token};

        // Close popup dialogue
        $scope.closePopup();

        $http({method: 'POST', url: '/api/nodes', data: postData})
          .success(function (res) {

            // Add successfully
            if (res.success && res.data) {

              notiFactory({type: 'success', content: 'Node added!'});

              // Notify NodeController the node has been added.
              // Properties of the new node should be transferred to NodeController.
              $scope.$broadcast('node.created', {
                scope: msg.scope,
                node: {

                  // id is returned from server
                  id: res.data.node.id,

                  // title just return to NodeController
                  title: msg.name,

                  // add the parent node to the path
                  path: msg.path.slice(0, msg.path.lastIndexOf('/'))
                }
              });
            }

            // Add failure
            else {
              notiFactory({type: 'failure', content: 'Add action failed'});
            }
          })

          // Request failed
          .error(function () {
            notiFactory({type: 'failure', content: 'Add action failed'});
          });
      });

      // Listen to node.deleting event from NodeController
      // for requesting to delete specific node in the tree
      $scope.$on('node.removing', function (event, msg) {

        // Construct url
        var url = '/api/nodes/' + encodeURIComponent(msg.path)
          , postData = {_method: 'delete', _csrf: $rootScope.token};

        // Close popup dialogue
        $scope.closePopup();

        $http({method: 'POST', url: url, data: postData})
          .success(function (res) {

            // Remove successfully
            if (res.success) {
              notiFactory({type: 'success', content: 'Node removed!'});

              // Notify NodeController the node has been removed
              $scope.$broadcast('node.removed', {scope: msg.scope});
            }
            else {
              notiFactory({type: 'failure', content: 'Remove action failed!'});
            }
          })
          .error(function () {
            notiFactory({type: 'failure', content: 'Remove action failed!'});
          });
      });

      // Listen to node.editing event from editController
      // which requests to update the content of specific node
      $scope.$on('node.updating', function (e, msg) {
        var url = '/api/nodes/' + encodeURIComponent(msg.path)
          , postData = {
            _method: 'put',
            _csrf: $rootScope.token,
            data: msg.data
          };

        $http({method: 'POST', url: url, data: postData})
          .success(function (res) {
            if (res.success) {
              notiFactory({type: 'success', content: 'Node content updated!'});

              $scope.$broadcast('node.updated');
            }
            else {
              notiFactory({type: 'failure', content: 'Update node content failed!'});
            }
          })
          .error(function () {
            notiFactory({type: 'failure', content: 'Update node content failed!'});
          });
      });


      $scope.$on('node.editing', function (e, isEditing) {
        $scope.isEditing = isEditing;
      });

      // Close popup, including hiding and cleaning
      $scope.closePopup = function () {
        $scope.animations.popup = false;
        $scope.popup = {};
      };

      // Notification factory
      var notiFactory = function (conf) {

        // Notification model
        $scope.notification.type = conf.type;
        $scope.notification.content = conf.content;

        // Show!
        $scope.animations.notification = true;

        // After the interval defined in $rootScope, notification will be hidden
        $timeout(function () {
          $scope.animations.notification = false;
        }, $rootScope.notifcationInterval);
      };
    }]);
}