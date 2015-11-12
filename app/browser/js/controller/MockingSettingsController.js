angular.module('app').controller('MockingSettingsCtrl', [
  '$scope',
  '$rootScope',
  '$q',
  'lodash',
  'ProjectsUser',
  'Analytics',
  'ipc',
  'Mocking',
  function ($scope, $rootScope, $q, _, ProjectsUser, Analytics, ipc, Mocking){
    $scope.port = 9090; // default port save to localStorage

    $scope.startMockServer = function(){

      //Lets require/import the HTTP module
      // send port number
      console.log("port", $scope.port);
      //console.log();
      Mocking.startServer($scope.port);
    };

    $scope.stopMockServer = function(){

      //Lets require/import the HTTP module

      //console.log();
      Mocking.stopServer();

    };

  }]);
