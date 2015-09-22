angular.module('app').controller('HeaderCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  'Auth',
  function ($scope, $rootScope, $state, Auth){

  init();

  function init(){
  }

  $scope.logout = function() {
    Auth.logout();
    $state.go('authentication');
  };

}]);
