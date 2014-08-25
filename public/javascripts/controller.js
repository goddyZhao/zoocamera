// Controller module
// Define all controllers in this file
angular.module('zoopervisor.controller', [])

  // MainController - outermost scope controller
  // In this controller, it manages transition animation
  // and common features
  .controller('MainController', ['$scope', '$timeout', function ($scope, $timeout) {

    // Animation flags manager
    $scope.animations = {

      // Control animation when page is ready
      ready: false,

      // Control animation when page or request is loading
      load: false,

      // Control animation when users login successfully
      login: false,

      // Control animation when shadow layer is needed
      shadow: false,

      // Control animation when notification need to popup
      notification: false
    };

    // Zookeeper object, store ip address and port
    $scope.zookeeper = {
      ip: '',
      port: ''
    };

    // A delay for displaying animation smoothly
    $timeout(function () {
      $scope.animations.ready = true;
    }, 250);

    // Submit the login form
    $scope.submit = function () {

      // Display loading icon
      $scope.animations.load = true;

      // todo: Start connecting zookeeper
      $timeout(function () {

        // Connect successfully
        $scope.$broadcast('node.load');
        $scope.animations.load = false;
        $scope.animations.login = true;
      }, 3000);
    };
  }])

  // AppController - controller of the real web app
  // contains 3 sub-controller and manages their templates.
  // Also it listens the events from child controllers and play
  // the role as a bridge of communication among them
  .controller('AppController', ['$scope', '$http', function ($scope, $http) {

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
        $scope.$broadcast('node.selected', node);
      }
    });

    // Listen to node.creating event from NodeController
    // for requesting to create a new node in the tree
    $scope.$on('node.creating', function (event, scope) {
      $scope.animations.shadow = true;
      $scope.templates.popup = '/templates/nodeAddDialogue.html';

      //// todo: send the create request to server side and send back the result
      //$scope.$broadcast('node.created', {});
    });

    // Listen to node.deleting event from NodeController
    // for requesting to delete specific node in the tree
    $scope.$on('node.removing', function (event, scope) {
      $scope.animations.shadow = true;
      $scope.templates.popup = '/templates/removeConfirm.html';

      //// todo: send the delete request to server side and send back the result
      //$scope.$broadcast('node.removed', {});
    });

    $scope.closePopup = function () {
      $scope.animations.shadow = false;
      $scope.templates.popup = '';
    };
  }])

  .controller('SiteController', ['$scope', function ($scope) {
    $scope.sites = ['127.0.0.1', '127.0.0.2'];
  }])

  // NodeController - controller of node tree
  // Manage node tree model and event, including add, remove
  // and search functionality
  .controller('NodeController', ['$scope', '$http', function ($scope, $http) {
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

    $scope.$on('node.load', function () {
      $scope.list = [
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
        }
      ];
    });
  }])

  // EditorController - controller of file content editor
  // Firstly, calculate editor's height according to window's height
  // and we make it be responsive
  .controller('EditorController', ['$scope', '$document', function ($scope, $document) {

    // To get the correct height of editor, we should get the height of the doms related
    // including window, navbar and editor container
    var getEditorHeight = function () {
      var windowHeight = window.innerHeight;
      var navbarHeight = $document[0].querySelector('.navbar').clientHeight;

      var containerStyle = getComputedStyle($document[0].querySelector('.main'));
      var containerPadding =
        parseInt(containerStyle.getPropertyValue('padding-top')) +
        parseInt(containerStyle.getPropertyValue('padding-bottom'));

      return windowHeight - navbarHeight - containerPadding - 150;
    };

    // Start calculating until user selects a node
    $scope.$on('node.selected', function () {

      if (!$scope.height) {
        $scope.height = getEditorHeight();
      }
    });

    // Makes editor be responsive
    window.onresize = function() {
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