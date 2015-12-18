angular.module('app').
directive("editorDescription", [function() {
  return {
    restrict: 'E',
    templateUrl: 'html/editor-description.html',
    controller: 'EditorCtrl',
    scope: {
      agParentEndpoint  : "=",
      agRequestChangeFlag : "="
    }
  };
}]);
