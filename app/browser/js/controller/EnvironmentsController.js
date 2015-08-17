angular.module('app').controller('EnvironmentsCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout){

  $scope.addEnvironment = function(type)
    {
      switch(type)
      {
        case 'Public':  $scope.environments.public.push(  {name:'', variables:[]} ); break;
        case 'Private': $scope.environments.private.push( {name:'', variables:[]} ); break;
      }
    };
  $scope.addVariable = function(type)
    {
      switch(type)
      {
        case 'Public':  $scope.environments.publicVariables.push(  {name:'', values:[]} ); break;
        case 'Private': $scope.environments.privateVariables.push( {name:'', values:[]} ); break;
      }
    };
  $scope.openExternal = function(link)
    {
      require('shell').openExternal(link);
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
