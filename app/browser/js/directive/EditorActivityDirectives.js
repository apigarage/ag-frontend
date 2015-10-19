angular.module('AGEndpointActivity', [])

// Used to populate items into the Endpoint Activity pane.
// There are 7 different activity types currently:
// 1. liEditorActivity = "create"   -> Endpoint Creation
// 2. liEditorActivity = "comment"  -> Comment
// 3. liEditorActivity = "flag"     -> Flag with/without Comment
// 4. liEditorActivity = "resolve"  -> Resolve with/without Comment
// 5. liEditorActivity = "edit"     -> Edit Endpoint
// 6. liEditorActivity = "collapse" -> Collapsed items
// 7. liEditorActivity = "form"     -> Form for typing new Comments
.directive('editorActivityItem', [function () {
  return {
    restrict: 'EA',
    templateUrl: 'html/editor-activity-item.html',
    replace: true,
    transclude: true,
    scope: {
      editorActivityType: "=",
      editorActivityNumCollapsed: "=",
      editorActivityTime: "=",
      editorActivityUser: "=",
      editorActivityUid: "=",
      editorActivityEndpoint: '=endpoint'
    },
    link: function ($scope, $elem, $attr, $ctrl, $transclude) {
      switch( $scope.editorActivityType )
      {
        case "create":
          $scope.iconClasses = 'fa-file-o';
          $scope.verb = 'created this endpoint';
          break;
        case "comment":
          $scope.iconClasses = 'fa-comment-o fa-flip-horizontal';
          $scope.showMenu = true;
          $scope.verb = 'commented';
          break;
        case "flag":
          $scope.iconClasses = 'fa-flag';
          $scope.iconBadge = 'activity-flagged';
          $scope.showMenu = true;
          $scope.verb = 'marked this endpoint as <span class="label activity-flagged">FLAGGED</span>';
          break;
        case "resolve":
          $scope.iconClasses = 'fa-check';
          $scope.iconBadge = 'activity-resolved';
          $scope.showMenu = true;
          $scope.verb = 'marked this endpoint as <span class="label activity-resolved">RESOLVED</span>';
          break;
        case "edit":
          $scope.iconClasses = 'fa-pencil';
          $scope.verb = 'edited this endpoint';
          break;
        case "collapse":
          $scope.iconClasses = 'fa-ellipsis-v';
          $scope.collapsed = true;
          break;
        case "form":
          $scope.iconClasses = 'fa-commenting-o fa-flip-horizontal';
          $scope.verb = "&middot; New comment"
          break;
      }

      $transclude(function(clone){
        if(clone && clone.length > 1 ){
          $scope.hasTransclusion = true;
        }
      });
    }
  }
}]);
