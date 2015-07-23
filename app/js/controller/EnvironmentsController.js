angular.module('app').controller('EnvironmentsCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout){

  $scope.environmentVariables = [
    'server-url',
    'access_token',
    'user_name'
  ];

  $scope.addEnvironment = function()
    {
      $scope.environments.push(null);
    };
  $scope.addVariable = function()
    {
      $scope.environmentVariables.push(null);
    };
  $scope.submit = function(responseCode)
    {
      $scope.$hide();
    };
  $scope.cancel = function(previewType)
    {
      $scope.$hide();
    };

}]);
