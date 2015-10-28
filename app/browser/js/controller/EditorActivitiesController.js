angular.module('app').controller('EditorActivitiesCtrl', [
  'lodash',
  '$scope',
  'Activities',
  'Users',
  function (
    _,
    $scope,
    Activities,
    Users){

      //$scope.agParentUpdateFlag({'bla':true});

      $scope.updateFlag = function(status){
        console.log("ActivitiesController", status);
        $scope.agParentUpdateFlag({'status':status});
        $scope.agParentFlag = status;
      };

      Users.getCurrentUserInformation().then(function(user){
        $scope.user = user;
      });

      // Pass item uuid from Editor Controller to this controller using Directive.
      $scope.$watch('agParentId',function(){
        // set to loading
        // get all Actitivies from the Item
        $scope.agParentFlag = status;
        loadActivities();
      });


      $scope.$on('loadActivities', function(event){
        //console.log('loadActivities', event);
        loadActivities();
      });

      function loadActivities(){
        if($scope.agParentId !== undefined){
          console.log('parentId', $scope.agParentId);
          Activities.getAll($scope.agParentId).then(function(activities){
            // pass the each item data forward to editor-activity-item
            if(activities.status == 500){
              console.log('Whoops! There was an error.');
            }else{
              // get all activities
              // print it back on screen
              $scope.activities = activities;
              //console.log('activities', $scope.activities);
            }

          });

        }
      }

  }]);
