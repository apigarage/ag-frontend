angular.module('app').controller('AuthenticationCtrl', [
  '$scope',
  '$timeout',
  '$modal',
  '$state',
  function ($scope, $timeout, $modal, $state){

  $scope.authentication = {
    type: 'existing',
    error: false
  };

  $scope.submit = function()
    {
      if( $scope.authentication.error )
        $state.go('app');

      $scope.authentication.error = true;
    };
  $scope.toggleAuthenticationType = function()
    {
      $scope.authentication.error = false;

      switch( $scope.authentication.type )
      {
        case 'existing':
        {
          $scope.authentication.type = 'register';
          break;
        }
        case 'register':
        {
          $scope.authentication.type = 'existing';
          break;
        }
      }
    };

}]);
