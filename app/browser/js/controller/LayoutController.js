angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$rootScope',
  '$modal',
  '$state',
  '$window',
  'Projects',
  'Auth',
  function ($scope, $rootScope, $modal, $state, $window, Projects, Auth){


  function init(){
    $scope.layout = {
      sidebarExpanded: false,
      historyMaximized: false
    };
    $scope.online = $window.navigator.onLine;
    $scope.setConnectionStatus($scope.online);
    if(!$rootScope.currentProjectId) $state.go('projectcreateoropen');
    return Projects.loadProjectToRootScope($rootScope.currentProjectId);
  }

  $window.addEventListener("online", function () {
      $scope.setConnectionStatus(true);
      $rootScope.$digest();
  }, true);

  $window.addEventListener("offline", function () {
      $scope.setConnectionStatus(false);
      $rootScope.$digest();
  }, true);

  $scope.setConnectionStatus = function (online){
      $scope.online = online;
      $scope.connectionStatus = "Offline";
      if($scope.online) $scope.connectionStatus = "Online";
  };

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


    init();

}]);
