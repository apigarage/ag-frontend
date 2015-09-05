angular.module('app').controller('EnvironmentsCtrl', [
  '$scope',
  '$focus',
  'Projects',
  function ($scope, $focus, Projects){

  //
  // --  Environments Functions
  //
  $scope.addEnvironment = function(type){
    var env = {name: ''};
    env.private = (type == 'private');
    return Projects.addNewEnvironment(env);
  };

  $scope.updateEnvironment = function(environment){
    return Projects.updateEnvironment(environment);
  };

  //
  // --  Variables Functions
  //
  $scope.addVariable = function(sourceType){
    $focus(sourceType + '-var-value-is-'); // Trick to highlight the empty variable name, if exists
    var variable = {name: ''};
    return Projects.addNewVariable(variable);
  };

  $scope.updateVariable = function(variable){
    return Projects.updateVariable(variable);
  };

  //
  // --  Values Functions
  //
  $scope.updateValue = function(variable, environment){
    return Projects.updateVariableEnvironmentValue(
      variable.project_key_id, environment.id, variable.value
    );
  };

  // obj can be an environment or a variable
  $scope.closeEditMode = function(obj){
    obj.edit = false;
  };

  $scope.submit = function(responseCode){
    $scope.$hide();
  };

  $scope.cancel = function(previewType){
    $scope.$hide();
  };

}]);
