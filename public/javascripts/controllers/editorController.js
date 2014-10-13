if (app) {

  // EditorController - controller of file content editor
  // Firstly, calculate editor's height according to window's height
  // and we make it be responsive
  app.controller('EditorController', ['$scope', function ($scope) {

    var editor;
    var oldContent = '';

    $scope.aceLoaded = function(_editor){
      editor = _editor;
    };

    $scope.edit = function(){
      // Notify parent controller that editor is open
      $scope.$emit('node.editing', true);
      $scope.editing = true;
      oldContent = editor.getValue();
      editor.focus();
    };

    $scope.cancel = function(){
      editor.setValue(oldContent);
      $scope.editing = false;
    };

    $scope.save = function(){
      $scope.editing = false;
      $scope.$emit('node.updating', {path: $scope.path, data: editor.getValue()});
    };

    $scope.syntax = {};
    $scope.syntaxes = [
      { title: 'Plain Text', name: 'plain_text' },
      { title: 'XML', name: 'xml' },
      { title: 'JSON', name: 'json' }
    ];
    $scope.syntax.selected = $scope.syntaxes[0];

    $scope.mode = {};
    $scope.modes = [
      { title: 'Normal', name: '' },
      { title: 'VIM', name: 'vim' },
      { title: 'Emacs', name: 'emacs' }
    ];

    $scope.$watch('mode.selected', function(newVal, oldVal){
      var mode = (newVal && newVal.name) || '';
      if (mode) {
        editor.setKeyboardHandler('ace/keyboard/' + mode);
      }
      else {
        editor.setKeyboardHandler();
      }
      editor.focus();
    });
    
    $scope.$watch('syntax.selected', function(newVal, oldVal){
      var lang = (newVal && newVal.name) || 'plain_text';
      editor.getSession().setMode('ace/mode/' + lang);
      editor.focus();
    });

    $scope.$watch('editing', function(newVal, oldVal){
      var readonly = !newVal;
      // readonly hack from https://github.com/ajaxorg/ace/issues/266
      editor.setOptions({
        readOnly: readonly,
        highlightActiveLine: !readonly,
        highlightGutterLine: !readonly
      });
      editor.renderer.$cursorLayer.element.style.opacity = readonly ? 0 : 100;
    });

    $scope.$on('node.updated', function () {
      // Notify parent controller that editor is close
      $scope.$emit('node.editing', false);
      $scope.editing = false;
    });

    $scope.$on('node.selected', function (e, msg) {
      $scope.path = (msg.node.path === '/' ? '' : msg.node.path) + '/' + msg.node.title;

      if (msg.data.data) {
        editor.setValue(msg.data.data);
      }
      else {
        editor.setValue('');
      }
    });

    $scope.$on('node.content.unsaved', function (e, newNode) {
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
          editor.setValue(oldContent);
          $scope.$emit('node.updated');
          $scope.$emit('node.selecting', newNode);
        }
      });
    });
  }]);
}