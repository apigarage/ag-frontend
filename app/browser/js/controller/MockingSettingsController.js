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
    var localStorage = $window.localStorage;

    if(localStorage.getItem('defaultPort') === undefined ||
    localStorage.getItem('defaultPort') === "null"){
       $scope.port = 9090; // default port save to localStorage
     }else{
       $scope.port =  localStorage.getItem('defaultPort');
     }
    $scope.startMockServer = function(port){

      //Lets require/import the HTTP module

      console.log("port", $scope.port);

      Mocking.startServer($scope.port);
      localStorage.setItem("defaultPort", $scope.port);
    };

    $scope.stopMockServer = function(){

      //Lets require/import the HTTP module

      //console.log();
      Mocking.stopServer();

    };

  }]);
