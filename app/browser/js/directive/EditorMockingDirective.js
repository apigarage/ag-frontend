angular.module('app').
directive("editorMocking", [function() {
  return {
    restrict: 'E',
    templateUrl: 'html/editor-mocking.html',
    controller: 'MockingCtrl',
    scope: {
      agParentEndpoint  : "=",
    }
  };
}]);
