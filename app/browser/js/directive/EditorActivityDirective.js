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
.directive('editorActivityItem', ['Activities', '$rootScope', function (activities, $rootScope) {
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
      editorActivityEndpoint: "=",
      editorActivityParentid: "="
    },
    link: function ($scope, $elem, $attr, $ctrl, $transclude) {
      console.log($scope);
      switch( $scope.editorActivityType )
      {
        case "create":
          $scope.iconClasses = 'fa-file-o';
          $scope.verb = 'created this endpoint';
          break;
        case "comment":
          $scope.iconClasses = 'fa-comment-o fa-flip-horizontal';
          // TODO: UAC Don't show the menu if it isn't the correct user
          $scope.showMenu = true;
          $scope.verb = 'commented';
          break;
        case "flag":
          $scope.iconClasses = 'fa-flag';
          $scope.iconBadge = 'activity-flagged';
          // TODO: UAC Don't show the menu if it isn't the correct user
          $scope.showMenu = true;
          $scope.verb = 'marked this endpoint as <span class="label activity-flagged">FLAGGED</span>';
          break;
        case "resolve":
          $scope.iconClasses = 'fa-check';
          $scope.iconBadge = 'activity-resolved';
          // TODO: UAC Don't show the menu if it isn't the correct user
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
          $scope.verb = "&middot; New comment";
          $scope.endpoint = $scope.editorActivityEndpoint;
          break;
      }

      $transclude(function(clone){
        if(clone && clone.length > 1 ){
          $scope.hasTransclusion = true;
        }
      });

      $scope.submitComment = function(commentForm, currentEndpoint){


        var description;
        if(commentForm.commentDescription.$modelValue === undefined)
        {
          description = '';
        }else{
          description = commentForm.commentDescription.$modelValue;
        }

        var data;
        if(commentForm.isResolved){
          data = {
            'type' : 'resolve',
            'description' : description
          };
        }else{
          data = {
            'type' : 'flag',
            'description' : description
          };
        }

        console.log('create a comment', currentEndpoint, data);
        if(commentForm.edit.$modelValue){
          console.log('parentid', $scope.editorActivityParentid);

          return activities.update($scope.editorActivityParentid, currentEndpoint.uuid, data)
            .then(function(item){
              //handle error
            }).finally(function(data){
              $rootScope.$broadcast('loadActivities');
            });
        }else{
          console.log('parentid', $scope.editorActivityParentid);
          // TODO: Update editprActivityParentID item FLAG
          return activities.create($scope.editorActivityParentid, data).then(function(item){
            // handle error? 
          }).finally(function(data){
            $rootScope.$broadcast('loadActivities');
          });
        }
      };

      $scope.editComment = function(data){
        console.log('data', data);

        // hide edit option

        $scope.showMenu = false;
        // TODO: hide flag resolve button

        $scope.editorActivityType = "form";
        $scope.commentDescription = data.description;
        $scope.commentEdit = true;

        // Need a way to cancel an Edit
        // No way to flag an edited comment
        console.log('$scope.editorActivityEndpoint.uuid', $scope.editorActivityEndpoint.uuid);
      };

      $scope.deleteComment = function(currentEndpoint){
        // Need a prompt confirmation
        console.log('currentComment.uuid',$scope.editorActivityEndpoint.uuid);

        return activities.remove($scope.editorActivityParentid, currentEndpoint.uuid)
          .then(function(item){
            //handle error
          }).finally(function(data){
            $rootScope.$broadcast('loadActivities');
          });
      };

    }
  };
}]);
