angular.module('app').controller('EditorActivitiesCtrl', [
  '$scope',
  'Activities',
  'Users',
  function (
    $scope,
    Activities,
    Users){

      $scope.updateFlag = function(status){
        $scope.agParentUpdateFlag({'status':status});
      };

      $scope.updateActivities = function(activityItem, action){

        switch (action) {
          case "update":
            for(i=0; i < $scope.activities.length; i++){
              if($scope.activities[i].uuid == activityItem.uuid){
                $scope.activities[i].description = activityItem.description;
                continue;
              }
            }
            break;
          case "remove":
            for(i=0; i < $scope.activities.length; i++){
              if($scope.activities[i].uuid == activityItem.uuid){
                $scope.activities.splice(i, 1);
                continue;
              }
            }
            break;
          default: // Add to end of list assumes that it is in order
            if($scope.activities !== undefined){
              $scope.activities.push(activityItem);
            }
        }
      };

      Users.getCurrentUserInformation().then(function(user){
        $scope.user = user;
      });

      $scope.$watch('agParentActivityItem',function(){
        $scope.updateActivities($scope.agParentActivityItem);
      });
      // When Endpoint changes load comments
      $scope.$watch('agParentEndpoint.uuid',function(){
        loadActivities();
      });

      function loadActivities(){
        $scope.activities = [];
        if($scope.agParentEndpoint.uuid !== undefined){
          Activities.getAll($scope.agParentEndpoint.uuid).then(function(activities){
            // pass the each item data forward to editor-activity-item
            if(activities.status == 500){
              console.log('Whoops! There was an error.');
            }else{
              // get all activities
              // print it back on screen
              $scope.activities = activities;
            }

          });
        }
      }

  }]);
