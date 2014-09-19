if (app) {

  // NodeController - controller of node tree
  // Manage node tree model and event, including add, remove
  // and search functionality
  app.controller('NodeController', ['$scope', '$http', '$rootScope', '_',
    function ($scope, $http, $rootScope, _) {

      // Add path property to every node in the tree.
      // Example - path: 'node/subnode'
      var addPath = function (tree, path) {

        angular.forEach(tree, function (node) {

          // Top level node
          if (!path) {
            node.path = '/';
            path = '';
          }
          else {
            node.path = path;
          }

          // Recursively execute if node has sub node(s)
          if (node.items.length > 0) {
            addPath(node.items, path + '/' + node.title);
          }
        });

        return tree;
      };

      // Search node(s) in tree
      var search = function (list, pattern, parents) {

        if (list.length > 0 && pattern) {

          angular.forEach(list, function (node) {

            // Clone the parent stack
            var parentsClone = _.clone(parents) || [];

            // Check whether node's name matches pattern
            // search property means whether this node should show in the result tree
            // hit property means whether this node is one of the result which should be highlighted
            node.search = node.title.indexOf(pattern) > -1;
            node.hit = node.title.indexOf(pattern) > -1;

            // If this node matches the pattern, all parent nodes should show in the result tree
            if (node.title.indexOf(pattern) > -1) {
              angular.forEach(parents || [], function (parent) {
                parent.search = true;
              });
            }

            // If has children nodes, add current node to parent nodes collection
            // and search recursively
            if (node.items.length > 0) {
              parentsClone.push(node);
              search(node.items, pattern, parentsClone);
            }
          });
        }

        return list;
      };

      // Get nodes of current host
      var getNodeTree = function () {

        $http({method: 'GET', url: '/api/nodes'})
          .success(function (res) {

            if (res.success && res.data) {

              // Add path property to every node in the tree
              $scope.nodes = addPath(res.data.nodes);

              // Currently shown tree is the original tree
              $scope.current = $scope.nodes;

              // 'show' mode
              $scope.mode = 'show';
            }
          });
      };

      // Default value of search pattern
      $scope.searchPattern = '';

      // Search method
      $scope.searchNode = function () {

        // Switch mode to 'search'
        $scope.mode = 'search';

        // Loading icon for search
        $scope.searching = true;

        // Clean current displayed node tree
        $scope.current = [];

        // Cancel current node selection
        $scope.$emit('node.selecting', null);

        // Empty search pattern means restore tree to original status
        // and switch mode to 'show'
        if (!$scope.searchPattern) {
          $scope.mode = 'show';
        }

        // Execute search and change the model
        $scope.current = search($scope.nodes, $scope.searchPattern, null);

        // Hide loading icon
        $scope.searching = false;
      };

      // Tree options
      $scope.options = {};

      // Toggle between collapse and expand
      $scope.toggle = function (scope) {
        scope.toggle();
      };

      // User selects a node, emit an event to AppController
      // and change the model $scope.selectedNode
      $scope.select = function (node) {
        $scope.$emit('node.selecting', node);
      };

      // User intends to remove a node from node tree,
      // emit an event to notify AppController of processing
      $scope.removeItem = function (scope, node) {
        $scope.$emit('popup', {
          header: 'Please confirm',
          content: 'Are you sure you want to REMOVE this node from zookeeper?',
          buttons: [
            {
              type: 'close',
              icon: 'cancel',
              text: 'cancel'
            },
            {
              type: 'submit',
              icon: 'ok',
              text: 'remove'
            }
          ],
          submit: function () {
            $scope.$emit('node.removing', {
              scope: scope,
              path: (node.path === '/' ? '' : node.path) + '/' + node.title
            });
          }
        });
      };

      // User intends to add a new sub node on a specific node,
      // emit an event to notify AppController of processing
      $scope.newSubItem = function (scope, node) {

        $scope.$emit('popup', {
          header: 'Enter node name',
          template: '/templates/nodeAddDialogue.html',
          buttons: [
            {
              type: 'close',
              icon: 'cancel',
              text: 'cancel'
            },
            {
              type: 'submit',
              icon: 'ok',
              text: 'apply'
            }
          ],
          submit: function (model) {
            $scope.$emit('node.creating', {
              scope: scope,
              path: (node.path === '/' ? '' : node.path) + '/' + node.title + '/' + model.nodeName,
              name: model.nodeName
            });
          }
        });
      };

      // Node has been added successfully on server side and
      // a node.created event fires to keep client side sync
      // with data in server
      $scope.$on('node.created', function (event, msg) {
        var scope = msg.scope;
        var nodeData = scope.$modelValue;

        nodeData.items.push({
          id: msg.node.id,
          title: msg.node.title,
          path: msg.node.path,
          items: []
        });
      });

      // Node has been removed successfully on server side and
      // and a node.removed event fires to keep client side sync
      // with data in server
      $scope.$on('node.removed', function (event, msg) {
        msg.scope.remove();
      });

      // 
      $scope.$on('tree.fetch', function () {
        getNodeTree();
      });

      if ($rootScope.isLogin) {
        $scope.$emit('tree.fetch');
      }
    }]);
}