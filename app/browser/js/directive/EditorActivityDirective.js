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
.directive('agEditorActivityItem', ['Activities', '$rootScope', '$window',
  function (activities, $rootScope, $window) {
  return {
    restrict: 'EA',
    templateUrl: 'html/editor-activity-item.html',
    replace: true,
    transclude: true,
    scope: {
      agEditorActivityType: "=",
      agEditorActivityNumCollapsed: "=",
      agEditorActivityTime: "=",
      agEditorActivityUser: "=",
      agEditorActivityUid: "=",
      agEditorActivityEndpoint: "=",
      agEditorActivityParentid: "=",
      agEditorActivityFlag: "=",
      agEditorActivityFlagStatus: "&",
    },
    link: function ($scope, $elem, $attr, $ctrl, $transclude) {

      // Get current user
      var localStorage = $window.localStorage;
      $scope.user = JSON.parse(localStorage.getItem("currentUser"));

      // Build item activities
      switch( $scope.agEditorActivityType )
      {
        case "create":
          $scope.iconClasses = 'fa-file-o';
          $scope.verb = 'created this endpoint';
          break;
        case "comment":
          $scope.iconClasses = 'fa-comment-o fa-flip-horizontal';
          $scope.showMenu = showMenu();
          $scope.verb = 'commented';
          break;
        case "flag":
          $scope.iconClasses = 'fa-flag';
          $scope.iconBadge = 'activity-flagged';
          $scope.showMenu = showMenu();
          $scope.verb = 'marked this endpoint as <span class="label activity-flagged">FLAGGED</span>';
          break;
        case "resolve":
          $scope.iconClasses = 'fa-check';
          $scope.iconBadge = 'activity-resolved';
          $scope.showMenu = showMenu();
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
          console.log('form');
          $scope.iconClasses = 'fa-commenting-o fa-flip-horizontal';
          $scope.verb = "&middot; New comment";
          $scope.endpoint = $scope.editorActivityEndpoint;
          $scope.commentDescription = "";
          break;
      }

      $transclude(function(clone){
        if(clone && clone.length > 1 ){
          $scope.hasTransclusion = true;
        }
      });

      function showMenu(){
        return $scope.agEditorActivityEndpoint.user.id == $scope.user.id
      };

      // submit flagged comment
      $scope.submitFlaggedComment = function(commentForm, currentEndpoint, currentEndpointFlag){
        var description;
        if(commentForm.commentDescription.$modelValue === undefined)
        {
          description = '';
        }else{
          description = commentForm.commentDescription.$modelValue;
        }

        if(currentEndpointFlag){
          data = {
            'type' : 'flag',
            'description' : description
          };
        }else{
          data = {
            'type' : 'resolve',
            'description' : description
          };
        }

        return activities.create($scope.agEditorActivityParentid, data).then(function(item){
          // TODO: handle error if any
          // Update current project item flagged value
          $scope.updateFlag(currentEndpointFlag);
        }).finally(function(data){
          // Refresh Comment Form
          commentForm.$setPristine();
          $scope.commentDescription = "";
          $rootScope.$broadcast('loadActivities');
        });
      };

      $scope.updateFlag = function(status){
        $scope.agEditorActivityFlagStatus({'status':status});
        $scope.agEditorActivityFlag = status;
      };

      $scope.submitComment = function(commentForm, currentEndpoint){

        var description;
        if(commentForm.commentDescription.$modelValue === undefined)
        {
          description = '';
        }else{
          description = commentForm.commentDescription.$modelValue;
        }

        if(commentForm.edit.$modelValue){
          // Update Comment
          data = {
            'description' : description
          };

          return activities.update($scope.agEditorActivityParentid, currentEndpoint.uuid, data)
            .then(function(item){
              // TODO: handle errors if any
            }).finally(function(data){
              $rootScope.$broadcast('loadActivities');
            });

        }else{
          // Create Comment
          // TODO: Update editprActivityParentID item FLAG
          data = {
            'type' : 'comment',
            'description' : description
          };
          return activities.create($scope.agEditorActivityParentid, data).then(function(item){
            // TODO: handle errors if any
          }).finally(function(data){
            // Clear Form
            commentForm.$setPristine();
            $scope.commentDescription = "";
            $rootScope.$broadcast('loadActivities');
          });
        }
      };

      $scope.editComment = function(){
        // Load form
        $scope.showMenu = false;
        $scope.agEditorActivityType = "form";
        $scope.commentDescription = data.description;
        $scope.commentEdit = true;
        // No way to cancel an Edit
        // No way to flag an edited comment
      };

      $scope.deleteComment = function(currentEndpoint){
        return activities.remove($scope.agEditorActivityParentid, currentEndpoint.uuid)
          .then(function(item){
            // TODO: handle errors if any
          }).finally(function(data){
            // Reload comments
            $rootScope.$broadcast('loadActivities');
          });
      };

    }
  };
}]);
