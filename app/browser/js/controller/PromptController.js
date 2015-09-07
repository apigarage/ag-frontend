// This is a generic controller for taking a simple text input.
// It can be also used to take "yes" or "no" types of input.
angular.module('app').controller('PromptCtrl', [
  'lodash',
  '$scope',
  function (_, $scope){

    function init(){
      $scope.promptProperty = {};
      setPromptMessage(false, "", false);
      var contentData = {};
      try {
        /*
        Content property JSON object

        'modalType': 'string', // value to determine how Submit is handled
        // modal window properties
        'disableCloseButton': boolean,
        'promptMessage': 'boolean',
        'promptMessageText': 'string',
        'promptIsError': boolean,

        // submit button properties
        'showSubmitButton' : boolean,
        'disbledSubmitButton' : boolean,
        'submitButtonText' : 'string',

        // discard button properties
        'showDiscardButton' : boolean,
        'disbleDiscardButton' : boolean,
        'discardButtonText' : 'string',

        // input prompt properties
        'placeHolderInputText': 'string',
        'labelInputText': 'string',
        'showInputPrompt' : boolean,

        // input email prompt properties
        'placeHolderInputEmailText': 'string',
        'labelInputEmailText': 'string',
        'showInputEmailPrompt' : boolean
        */
        contentData = JSON.parse($scope.content);
      } catch (e) {
        // if it fails to parse the JSON content data it will set blank default
        $scope.promptProperty = {};
      }
      _.forEach(contentData, function(value, property) {
        if(_.isBoolean(value)){
          setModalProperty(property, value, true);
        }
        else{
          setModalProperty(property, value);
        }
      });
    }

    function setModalProperty(property, value, setBoolean){
      if(_.isUndefined(setBoolean)) setBoolean = false;
      if(setBoolean){
       $scope.promptProperty[property] = value;
      }
      else if (_.isUndefined(value)){
        $scope.promptProperty[property] = "";
      }
      else{
        $scope.promptProperty[property] = value;
      }
    }

    function setLoading(status){
      if (status){
        $scope.promptProperty.submitLoading = true; // start loading button
        $scope.promptProperty.disableCloseButton = true; // disable the closing of the modal
      }else{
        $scope.promptProperty.submitLoading = false;
        $scope.promptProperty.disableCloseButton = false;
      }
    }

    function setPromptMessage(showPrompt, promptText, showError){
      $scope.promptProperty.promptMessage = showPrompt;
      $scope.promptProperty.promptMessageText = promptText;
      $scope.promptProperty.promptIsError = showError;
    }

    $scope.submit = function(promptControllerForm){
      setLoading(true);
      switch ($scope.promptProperty.modalType) {
        case 'shareProject':
          return $scope.success(promptControllerForm.inputEmailPrompt.$viewValue).then(function(response){
            setPromptMessage(true, response + promptControllerForm.inputEmailPrompt.$viewValue, false);
          })
          .catch(function(error){
            setPromptMessage(true, "Something went wrong " + error.message, true);
          })
          .finally(function(){
            setLoading(false);
          });
        case 'addCategory':
          return $scope.success(promptControllerForm.inputPrompt.$viewValue).then(function(){
            $scope.$hide();
          })
          .catch(function(error){
            setPromptMessage(true, "Something went wrong " + error.message, true);
          })
          .finally(function(){
            setLoading(false);
          });
        default:
          setLoading(false);
      }
    };

    $scope.discard = function(){
      $scope.promptProperty = {};
      setPromptMessage(false, "", false);
      return $scope.cancel().then(function(){
        $scope.$hide();
      });
    };

    init();
  }
]);
