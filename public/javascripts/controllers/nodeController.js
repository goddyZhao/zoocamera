if (app) {

  // NodeController - controller of node tree
  // Manage node tree model and event, including add, remove
  // and search functionality
  app.controller('NodeController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var getNodeList = function () {
      return [
        {
          "id": 1,
          "title": "dragon-breath",
          "items": []
        },
        {
          "id": 2,
          "title": "moiré-vision",
          "items": [
            {
              "id": 21,
              "title": "tofu-animation",
              "items": [
                {
                  "id": 211,
                  "title": "spooky-giraffe",
                  "items": []
                },
                {
                  "id": 212,
                  "title": "bubble-burst",
                  "items": []
                }
              ]
            },
            {
              "id": 22,
              "title": "barehand-atomsplitting",
              "items": []
            }
          ]
        },
        {
          "id": 3,
          "title": "unicorn-zapper",
          "items": []
        },
        {
          "id": 4,
          "title": "romantic-transclusion",
          "items": []
        },
        {
          "id": 5,
          "title": "dragon-breath",
          "items": []
        },
        {
          "id": 6,
          "title": "moiré-vision",
          "items": [
            {
              "id": 61,
              "title": "tofu-animation",
              "items": [
                {
                  "id": 611,
                  "title": "spooky-giraffe",
                  "items": []
                },
                {
                  "id": 612,
                  "title": "bubble-burst",
                  "items": []
                }
              ]
            },
            {
              "id": 62,
              "title": "barehand-atomsplitting",
              "items": []
            }
          ]
        },
        {
          "id": 7,
          "title": "unicorn-zapper",
          "items": []
        },
        {
          "id": 8,
          "title": "romantic-transclusion",
          "items": []
        }
      ];
    };

    // Default value of search pattern
    $scope.searchPattern = '';

    // Search method
    $scope.searchNode = function () {
      $scope.current = [];
      $scope.searching = true;

      $scope.$emit('node.selecting', null);

      var search = function (list, pattern) {
        var searchResult = [];

        if (list.length > 0 && pattern) {
          angular.forEach(list, function (node) {
            if (node.title.indexOf(pattern) > -1) {
              searchResult.push({
                id: node.id,
                title: node.title,
                items: []
              });
            }

            if (node.items.length > 0) {
              search(node.items);
            }
          });
        }

        return searchResult;
      };

      $timeout(function () {
        $scope.current = (!$scope.searchPattern) ? $scope.nodes : search($scope.nodes, $scope.searchPattern);
        $scope.searching = false;
      }, 500);
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
      $scope.$emit('node.removing', scope);
    };

    // User intends to add a new sub node on a specific node,
    // emit an event to notify AppController of processing
    $scope.newSubItem = function (scope) {
      $scope.$emit('node.creating', scope);
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

    $scope.$watch('zookeeper', function (zookeeper) {

      // todo: use zookeeper address to get the node list from server
      $scope.nodes = getNodeList();
      $scope.current = $scope.nodes;
    });
  }]);
}