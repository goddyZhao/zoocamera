// EditorController - controller of file content editor
// Firstly, calculate editor's height according to window's height
// and we make it be responsive
app.controller('EditorController', ['$scope', function ($scope) {

  // Editor instance
  var editor;

  // Use for cache old content during the editing process
  var oldContent = '';

  // Content model of the editor
  $scope.editorContent = '';

  // Onload function in directive
  // Get the current ace editor instance
  $scope.aceLoaded = function (_editor) {
    editor = _editor;
  };

  // Activate edit mode
  $scope.edit = function () {

    // Cache the old content for cancel action
    oldContent = $scope.editorContent;

    // Switch to edit mode
    $scope.editing = true;

    // Notify parent controller that editor is open
    $scope.$emit('node.editing', $scope.editing);

    editor.focus();
  };

  // Cancel edit mode
  $scope.cancel = function () {
    $scope.$emit('editor.restore', {restoreValue: true});
  };

  // Save and update node content
  $scope.save = function () {

    // Switch to read mode to prevent duplicated update
    $scope.editing = false;

    // Emit the update event with node path and new content data
    $scope.$emit('node.updating', {
      path: $scope.path,
      data: $scope.editorContent
    });
  };

  // Syntax model for the editor
  $scope.syntax = {};

  // Syntax models collection
  $scope.syntaxes = [
    {title: 'Plain Text', name: 'plain_text'},
    {title: 'XML', name: 'xml'},
    {title: 'JSON', name: 'json'}
  ];

  // Initialize the model
  $scope.syntax.selected = $scope.syntaxes[0];

  // Edit mode for the editor
  $scope.mode = {};

  // Edit modes model collection
  $scope.modes = [
    {title: 'Normal', name: ''},
    {title: 'VIM', name: 'vim'},
    {title: 'Emacs', name: 'emacs'}
  ];

  // Node content has been updated
  $scope.$on('node.updated', function () {
    $scope.$emit('editor.restore');
  });

  // A node has been selected, and the content of this node should be shown in the editor.
  // The path of the node should be cached as well for update action
  $scope.$on('node.selected', function (e, msg) {
    $scope.path = (msg.node.path === '/' ? '' : msg.node.path) + '/' + msg.node.title;

    if (msg.data.data) {
      $scope.editorContent = msg.data.data;
    }
    else {
      $scope.editorContent = '';
    }
  });

  // If user switches node during editing process, this event will emit and execute
  // following handler.
  $scope.$on('node.content.unsaved', function (e, newNode) {

    // A popup dialogue will be displayed to notify user this condition.
    $scope.$emit('popup', {
      header: 'Unsaved modification',
      content: 'You have <span class="alert">UNSAVED</span> modification in the editor.',
      buttons: [
        {
          type: 'close',
          icon: 'cancel',
          text: 'cancel'
        },
        {
          type: 'submit',
          icon: 'ok',
          text: 'Discard'
        }
      ],
      submit: function () {
        $scope.$emit('editor.restore', {restoreValue: true});
        $scope.$emit('node.selecting', newNode);
      }
    });
  });

  $scope.$on('editor.restore', function (e, msg) {

    if (msg && msg.restoreValue) {
      $scope.editorContent = oldContent;
    }

    // Switch to read mode
    $scope.editing = false;

    // Notify parent controller that editor is close
    $scope.$emit('node.editing', $scope.editing);
  });

  // Watch the change of mode
  $scope.$watch('mode.selected', function (newVal, oldVal) {
    var mode = (newVal && newVal.name) || '';
    if (mode) {
      editor.setKeyboardHandler('ace/keyboard/' + mode);
    }
    else {
      editor.setKeyboardHandler();
    }
    editor.focus();
  });

  // Watch the change of syntax
  $scope.$watch('syntax.selected', function (newVal, oldVal) {
    var lang = (newVal && newVal.name) || 'plain_text';
    editor.getSession().setMode('ace/mode/' + lang);
    editor.focus();
  });

  // Watch the change editing model to control the edit/readonly mode of the editor
  $scope.$watch('editing', function (newVal, oldVal) {
    var readonly = !newVal;

    // readonly hack from https://github.com/ajaxorg/ace/issues/266
    editor.setOptions({
      readOnly: readonly,
      highlightActiveLine: !readonly,
      highlightGutterLine: !readonly
    });
    editor.renderer.$cursorLayer.element.style.opacity = readonly ? 0 : 100;
  });
}]);