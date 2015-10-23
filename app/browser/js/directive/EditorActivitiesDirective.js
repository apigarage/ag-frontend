angular.module('app').
directive("editorActivities", ["Activities", function( activities ) {
  return {
    restrict: 'E',
    templateUrl: 'html/editor-activity.html',
    controller: 'EditorActivitiesCtrl',
    controllerAs: 'EditorActivitiesCtrl',
    scope: {
      parentType : "=",
      parentId : "="
    }
  };
}]);
