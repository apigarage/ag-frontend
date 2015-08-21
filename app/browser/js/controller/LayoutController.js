angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$state',
  'Projects',
  function ($scope, $rootScope, $modal, $state, Projects){

  init();

  function init(){
    $scope.layout = {
      sidebarExpanded: false,
      historyMaximized: false
    };

    // TODO - HARD CODED UNTIL THE PROJECT SCREEN.
    // $rootScope.currentProjectId = 4;
    return Projects.loadProjectToRootScope($rootScope.currentProjectId);

  }


  $scope.toggleHistory = function(){
    $scope.layout.historyMaximized = !$scope.layout.historyMaximized;
  };

  $scope.toggleSidebar = function(){
    $scope.layout.sidebarExpanded = !$scope.layout.sidebarExpanded;
  };

  $scope.openExternal = function(link){
    require('shell').openExternal(link);
  };

}]);
