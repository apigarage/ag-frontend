angular.module('app').controller('PromptCtrl', [
  '$scope',
  function ($scope){

  $scope.submit = function(responseCode)
    {
      $scope.$hide();
    };
  $scope.cancel = function(previewType)
    {
      $scope.$hide();
    };

}]);
