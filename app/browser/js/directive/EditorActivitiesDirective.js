angular.module('app').
directive("editorActivities", [function() {
  return {
    restrict: 'E',
    templateUrl: 'html/editor-activity.html',
    controller: 'EditorActivitiesCtrl',
    scope: {
      agParentType : "=",
      agParentId : "=",
      agParentFlag : "=",
      agParentUpdateFlag : "&",
      agParentEndpoint  : "="
    }
  };
}]);
