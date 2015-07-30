angular.module('app').controller('LayoutCtrl', [
  '$scope',
  '$timeout',
  '$modal',
  '$state',
  function ($scope, $timeout, $modal, $state){

  $scope.layout = {
    sidebarExpanded: false
  };

  $scope.toggleSidebar = function()
    {
      $scope.layout.sidebarExpanded = !$scope.layout.sidebarExpanded;
    };

}]);
