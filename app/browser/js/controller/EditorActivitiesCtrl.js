angular.module('app').controller('EditorActivitiesCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  '$window',
  '$filter',
  '$http',
  '$sce',
  '$modal',
  '$q',
  '$timeout',
  '$focus',
  'RequestUtility',
  'History',
  'Collections',
  'Projects',
  'Editor',
  'Activities',
  function (_, $scope, $rootScope, $window, $filter, $http, $sce, $modal, $q,
    $timeout, $focus, RequestUtility, History, Collections, Projects, Editor,
    Activities){
      console.log($rootScope);

      // Pass item uuid from Editor Controller to this controller using Directive.


      $scope.$watch('parentId',function(){
        // set to loading
        // get all Actitivies from the Item
        console.log('parentId', $scope.parentId);
        Activities.get($scope.parentId, $rootScope.currentProjectId).then(function(activities){
          console.log('activities',activities);
          // pass the each item data forward to editor-activity-item
          if(activities.status == 500){
            console.log('Whoops! There was an error.');
            $scope.showActivity = false;
          }else{

          //   activities.data = { 'type' : 'resolve',
          //   'time': Date.now(),
          //   'user': 'Zad'
          // };
          }

          }
        });

      });


  }]);
