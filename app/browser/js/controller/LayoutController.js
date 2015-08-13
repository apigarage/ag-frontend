angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$timeout',
  '$modal',
  '$state',
  function ($scope, $timeout, $modal, $state){

  $scope.layout = {
    sidebarExpanded: false,
    historyMaximized: false
  };

  $scope.toggleSidebar = function()
    {
      $scope.layout.sidebarExpanded = !$scope.layout.sidebarExpanded;
    };
  $scope.toggleHistory = function()
    {
      $scope.layout.historyMaximized = !$scope.layout.historyMaximized;
    };

}]);
