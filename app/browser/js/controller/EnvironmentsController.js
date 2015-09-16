angular.module('app').controller('EnvironmentsCtrl', [
  '$scope',
  '$focus',
  '$q',
  '$modal',
  'Projects',
  function ($scope, $focus, $q, $modal, Projects){

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

  $scope.deleteEnvironment = function(environment){
    var newModal = $modal({
      show: false,
      template: "html/prompt.html",
      backdrop: true,
      title: "Delete Environment",
      content: JSON.stringify({
        // modal window properties
        'disableCloseButton': false,
        'promptMessage': true,
        'promptMessageText': 'Are you sure you want to delete the environment - ' + environment.name  + ' ?' ,
        'promptIsError': true,
        'hideModalOnSubmit': true,

        // submit button properties
        'showSubmitButton' : true,
        'disbledSubmitButton' : false,
        'submitButtonText' : 'Delete',

        // discard button properties
        'showDiscardButton' : true,
        'disbleDiscardButton' : false,
        'discardButtonText' : 'Cancel',

        // input prompt properties
        'showInputPrompt' : false,
        'requiredInputPrompt' : false,

        // input email prompt properties
        'showInputEmailPrompt' : false,
        'requiredInputEmailPrompt': false,
      })
    });
    newModal.$scope.success = function(){
      return Projects.deleteEnvironment(environment);
    };

    newModal.$scope.cancel = function(){ return $q.resolve(); };

    newModal.$promise.then( newModal.show );
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

  $scope.deleteVariable = function(variable){
    var newModal = $modal({
      show: false,
      template: "html/prompt.html",
      backdrop: true,
      title: "Delete Variable",
      content: JSON.stringify({
        // modal window properties
        'disableCloseButton': false,
        'promptMessage': true,
        'promptMessageText': 'Are you sure you want to delete the variable - ' + variable.name  + ' ?' ,
        'promptIsError': true,
        'hideModalOnSubmit': true,

        // submit button properties
        'showSubmitButton' : true,
        'disbledSubmitButton' : false,
        'submitButtonText' : 'Delete',

        // discard button properties
        'showDiscardButton' : true,
        'disbleDiscardButton' : false,
        'discardButtonText' : 'Cancel',

        // input prompt properties
        'showInputPrompt' : false,
        'requiredInputPrompt' : false,

        // input email prompt properties
        'showInputEmailPrompt' : false,
        'requiredInputEmailPrompt': false,
      })
    });
    newModal.$scope.success = function(){
      return Projects.deleteVariable(variable);
    };

    newModal.$scope.cancel = function(){ return $q.resolve(); };

    newModal.$promise.then( newModal.show );
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

  $scope.close = function(previewType){
    $scope.$hide();
  };

}]);
