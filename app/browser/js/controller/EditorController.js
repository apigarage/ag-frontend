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
  function (_, $scope, $rootScope, $window, $filter, $http, $sce, $modal, $q,
    $timeout, $focus, RequestUtility, History, Collections, Projects, Editor){

    init();

    function init(){
      
      // Get all the activities for the current Endpoint
      // Set it as a local variable
    }

  }]);
