angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$modal',
  '$state',
  'Projects',
  function ($scope, $rootScope, $timeout, $modal, $state, Projects){

  init();

  function init(){
    $scope.layout = {
      sidebarExpanded: false
    };

    // TODO - HARD CODED UNTIL THE PROJECT SCREEN.
    // $rootScope.currentProjectId = 4;
    return Projects.loadProjectToRootScope($rootScope.currentProjectId);
  }

  $scope.toggleSidebar = function(){
    $scope.layout.sidebarExpanded = !$scope.layout.sidebarExpanded;
  };

}]);
