// This is a generic controller for taking a simple text input.
// It can be also used to take "yes" or "no" types of input.
angular.module('app').controller('PromptCtrl', [
  'lodash',
  '$scope',
  function (_, $scope){

    init();

    function init(){
      $scope.input = "";
      resetErrors();
    }

    function resetErrors(){
      $scope.inputErrorMessage = "";
      $scope.inputError = false;
    }

    function validInput(){
      if(_.isEmpty($scope.input)){
        $scope.inputErrorMessage = "Input cannot be blank.";
        $scope.inputError = true;
        return false;
      }
      return true;
    }

    $scope.submit = function(){
      // TODO - Show loading icon.
      resetErrors();
      if(!validInput()) return false;
      return $scope.success($scope.input).then(function(){
        $scope.$hide();
      })
      .catch(function(error){
        // Show input error
      });
    };

    $scope.discard = function(){
      resetErrors();
      return $scope.cancel().then(function(){
        $scope.$hide();
      });
    };

  }
]);
