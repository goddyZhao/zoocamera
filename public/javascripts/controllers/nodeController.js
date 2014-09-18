if (app) {

  // NodeController - controller of node tree
  // Manage node tree model and event, including add, remove
  // and search functionality
  app.controller('NodeController', ['$scope', '$http', '_',
    function ($scope, $http, _) {

      // Get nodes of current host
      $scope.getNodeTree = function () {

        $http({method: 'GET', url: '/api/nodes'})
          .success(function (res) {

            if (res.success && res.data) {
              $scope.nodes = res.data.nodes;
              $scope.current = $scope.nodes;
            }
          });
      };

      // Default value of search pattern
      $scope.searchPattern = '';

      // Search method
      $scope.searchNode = function () {
        $scope.current = [];
        $scope.searching = true;

        $scope.$emit('node.selecting', null);

        var search = function (list, pattern, path, parents) {
          var result = path;
          var parentsClone = _.clone(parents);

          if (list.length > 0 && pattern) {

            angular.forEach(list, function (node) {

              var index = result.push({
                id: node.id,
                title: node.title,
                items: [],
                search: node.title.indexOf(pattern) > -1,
                hit: node.title.indexOf(pattern) > -1
              });

              if (!parents) {
                parents = [];
                parentsClone = [];
              }
              else {
                if (node.title.indexOf(pattern) > -1) {
                  angular.forEach(parents, function (parent) {
                    parent.search = true;
                  });
                }
              }

              parentsClone.push(result[index - 1]);

              if (node.items.length > 0) {
                search(node.items, pattern, result[index - 1].items, parentsClone);
              }
              else {
                while(parentsClone.length > 0) {
                  parentsClone.pop();
                }
              }
            });
          }

          return result;
        };

        var filter = function (tree, path) {
          var result = path;

          if (tree.length) {
            angular.forEach(tree, function (node) {
              if (node.search) {
                var index = result.push({
                  id: node.id,
                  title: node.title,
                  items: [],
                  search: node.search,
                  hit: node.hit
                });

                if (node.items.length > 0) {
                  filter(node.items, result[index - 1].items)
                }
              }
            });
          }

          return result;
        };

        $scope.current = (!$scope.searchPattern)
          ? $scope.nodes
          : filter(search($scope.nodes, $scope.searchPattern, [], null), []);

        $scope.searching = false;
      };

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
      $scope.removeItem = function (scope) {
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
            $scope.$emit('node.removing', { scope: scope });
          }
        });
      };

      // User intends to add a new sub node on a specific node,
      // emit an event to notify AppController of processing
      $scope.newSubItem = function (scope) {
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
              model: model
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

        // todo: an id should be returned from server side
        nodeData.items.push({
          id: nodeData.id * 10 + nodeData.items.length,
          title: msg.name,
          items: []
        });
      });

      // Node has been removed successfully on server side and
      // and a node.removed event fires to keep client side sync
      // with data in server
      $scope.$on('node.removed', function (event, msg) {
        msg.scope.remove();
      });

      $scope.$on('tree.fetch', function () {
        $scope.getNodeTree();
      });
    }]);
}