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

      Users.getCurrentUserInformation().then(function(user){
        $scope.user = user;
      });

      // Pass item uuid from Editor Controller to this controller using Directive.
      $scope.$watch('parentId',function(){
        // set to loading
        // get all Actitivies from the Item
        loadActivities();


      });

      $scope.$on('loadActivities', function(event){
        console.log('loadActivities', event);
        loadActivities();
      });

      function loadActivities(){
        if($scope.parentId !== undefined){
          console.log('parentId', $scope.parentId);
          Activities.getAll($scope.parentId).then(function(activities){
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
