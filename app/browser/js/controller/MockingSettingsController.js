angular.module('app').controller('MockingSettingsCtrl', [
  '$scope',
  '$rootScope',
  '$q',
  '$window',
  'lodash',
  'ProjectsUser',
  'Analytics',
  'ipc',
  'Mocking',
  function ($scope, $rootScope, $q, $window, _, ProjectsUser, Analytics, ipc, Mocking){

    $scope.port = Mocking.port;
    if (Mocking.serverStatus === undefined){
      $scope.serverStatus = false;
    }else{
      $scope.serverStatus = Mocking.serverStatus;
    }

    $scope.mockingServerSwitch = function(){
      // if server is on turn it off
      if(Mocking.serverStatus){
        Mocking.stopServer();
        $scope.serverStatus = false;
      }else{ // if server is off turn it on
        Mocking.startServer($scope.port);
        $scope.serverStatus = true;
      }

    };

    $scope.startMockServer = function(port){
      Mocking.startServer($scope.port);
      localStorage.setItem("defaultPort", $scope.port);
    };

    $scope.stopMockServer = function(){
      Mocking.stopServer();
    };

  }]);
