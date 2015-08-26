angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$state',
  'Projects',
  'Auth',
  function ($scope, $rootScope, $modal, $state, Projects, Auth){

  init();

  function init(){
    $scope.layout = {
      sidebarExpanded: false,
      historyMaximized: false
    };
    if(!$rootScope.currentProjectId) $state.go('projectcreateoropen');
    return Projects.loadProjectToRootScope($rootScope.currentProjectId);
  }

  $scope.$watch(
    function(){
      return Auth.onlineStatus.isOnline();
    },
    function(online){
      $scope.online = online;
      $scope.ConnectionStatus = "Offline";
      if($scope.online) $scope.ConnectionStatus = "Online";
    }
  );

  $scope.refreshProject = function(){
    Projects.loadProjectToRootScope($rootScope.currentProjectId);
  };

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
