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
.directive('agEditorActivityItem', ['Activities', 'Items', '$rootScope', '$window', 'Analytics',
  function (activities, Items, $rootScope, $window, Analytics) {
  return {
    restrict: 'EA',
    templateUrl: 'html/editor-activity-item.html',
    replace: true,
    transclude: true,
    scope: {
      agActivityNumCollapsed: "=",
      agActivity: "=",
      agEndpoint: "=",
      agActivityForm:"@",
      agActivityFlagStatus: "&",
      agActivitiesUpdate: "&"
    },
    link: function ($scope, $elem, $attr, $ctrl, $transclude) {

      if( $scope.agActivity && $scope.agActivity.created_at ){
        $scope.agActivity.created_at = moment($scope.agActivity.created_at).fromNow();
      }

      // Get current user
      var localStorage = $window.localStorage;
      $scope.user = JSON.parse(localStorage.getItem("currentUser"));

      // Build item activities
      // Get current user
      if( $scope.agActivity &&
          $scope.agActivity.activity_type &&
          $scope.agActivity.activity_type.name ){

            switch($scope.agActivity.activity_type.name)
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
          }

      } else {

        $scope.iconClasses = 'fa-commenting-o fa-flip-horizontal';
        $scope.agActivity = {
          type: 'form'
        };
        $scope.verb = "&middot; New comment";

      }

      function showMenu(){
        return ($scope.agActivity.user.id == $scope.user.id);
      }

      function submitComment(comment){
        return activities.create($scope.agEndpoint.uuid, comment)
          .then(function(comment){
            // TODO: handle error if any
            $scope.updateActivities(comment, 'add');
          });
      }

      function clearForm(commentForm){
        commentForm.$setPristine();
        commentForm.description = "";
      }

      $scope.updateFlag = function(status){
        $scope.agActivityFlagStatus({'status':status});
        $scope.agEndpoint.flagged = status;
      };

      $scope.updateActivities = function(activityItem, action){
        $scope.agActivitiesUpdate(
          { 'activityItem' : activityItem,
            'action': action
          });
      };

      // Submit flagged comment
      $scope.submitFlaggedComment = function(commentForm){
        $scope.loadingFlagButton = true;
        $scope.commentButton = true;
        // Toggle Flagged Endpoint
        var flagged = !$scope.agEndpoint.flagged;

        var comment = {};
        // Create Flag/Resolve Comment add description
        comment.type = flagged ? 'flag' : 'resolve';
        comment.description = commentForm.description;

        // When user submits flagged comment
        Analytics.eventTrack('Submit Comment',
         {'from': 'EditorActivityDirective', 'commentType': comment.type});

        return submitComment(comment)
          .then(function(data){

            var itemData = {
              'flagged' : flagged
            };

            // Update Item
            Items.update($scope.agEndpoint.uuid, itemData)
              .then(function(comment){
                $scope.updateFlag(flagged);
                clearForm(commentForm);
              });

            $scope.loadingFlagButton = false;
            $scope.commentButton = false;
          });
      };

      $scope.submitComment = function(commentForm, currentActivity){
        // Set button to loading and disable commentButton
        $scope.commentFlagButton = true;
        $scope.loadingCommentButton = true;
        var comment = {
          'description' : commentForm.description
        };

        if(commentForm.edit){
          // Edit Comment
          // When user Edits comment
          Analytics.eventTrack('Submit Comment',
           {'from': 'EditorActivityDirective', 'commentType': 'update'});
          return activities.update($scope.agEndpoint.uuid, currentActivity.uuid, comment)
            .then(function(item){
              // TODO: handle errors if any
              // update comment
              $scope.updateActivities(item, 'update');
              // Reload comment box
              $scope.showMenu = true;
              $scope.agActivity.type = item.activity_type.name;
            });

        }else{
          // Set button to loading and disable commentButton
          $scope.commentFlagButton = true;
          $scope.loadingCommentButton = true;

          // Create Comment
          comment.type = 'comment';
          // When user submits comment
          Analytics.eventTrack('Submit Comment',
           {'from': 'EditorActivityDirective', 'commentType': comment.type});
          return submitComment(comment)
          .then(function(data){
            clearForm(commentForm);

            $scope.commentFlagButton = false;
            $scope.loadingCommentButton = false;
          });
        }
      };

      $scope.editComment = function(){
        // Load Edit Comment Form
        $scope.showMenu = false;
        $scope.agActivity.type = "form";
        $scope.commentForm.description = $scope.agActivity.description;
        $scope.commentForm.edit = true;
      };

      $scope.deleteComment = function(){

        return activities.remove($scope.agEndpoint.uuid, $scope.agActivity.uuid)
          .then(function(item){
            // TODO: handle errors if any

            // When user Deletes comment
            Analytics.eventTrack('Delete Comment',
             {'from': 'EditorActivityDirective'});
            $scope.updateActivities({ 'uuid':$scope.agActivity.uuid}, 'remove');
          });
      };

    }
  };
}]);
