angular.module('app').controller('HeaderCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  'Auth',
  function ($scope, $rootScope, $state, $window, Auth){

  function init(){
    $scope.online = $window.navigator.onLine;
    $scope.setConnectionStatus($scope.online);
  }

  $scope.logout = function() {
    Auth.logout();
    $state.go('authentication');
  };

  $scope.setConnectionStatus = function (online){
      $scope.online = online;
      $scope.connectionStatus = "Offline";
      if($scope.online){
        $scope.connectionStatus = "";
      }
  };

  $window.addEventListener("online", function () {
      $scope.setConnectionStatus(true);
      $rootScope.$digest();
  }, true);

  $window.addEventListener("offline", function () {
      $scope.setConnectionStatus(false);
      $rootScope.$digest();
  }, true);

  init();

}]);
