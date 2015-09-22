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
        // modal window properties
        'disableCloseButton': boolean,
        'promptMessage': 'boolean',
        'promptMessageText': 'string',
        'promptIsError': boolean,
        'hideModalOnSubmit': boolean,

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
        'inputPromptText' : 'string',
        'showInputPrompt' : boolean,
        'requiredInputPrompt' : boolean,

        // input email prompt properties
        'placeHolderInputEmailText': 'string',
        'labelInputEmailText': 'string',
        'showInputEmailPrompt' : boolean,

        // dropdown prompt properties
        'showDropdown' : boolean,
        'dropdownItems' : object,
        'dropdownSelectedItem' : 'object{item{name:string}}',
        'showDividerItem' : boolean,
        'dividerItemName' : 'string',
        'requiredDropDownItem' : boolean,
        'labelDropdownText': 'string',

        // input prompt properties A
        'placeHolderInputTextA': 'string',
        'labelInputTextA': 'string',
        'inputPromptTextA' : 'string',
        'showInputPromptA' : boolean,
        'requiredInputPromptA' : boolean,

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

    function getFormVisibleData(promptControllerForm){
      var data = {};

      if($scope.promptProperty.showInputPrompt){
        data.name = promptControllerForm.inputPrompt.$viewValue;
      }

      if($scope.promptProperty.showInputEmailPrompt){
        data.email = promptControllerForm.inputEmailPrompt.$viewValue;
      }

      if($scope.promptProperty.showDropdown){
        data.dropdownItem = $scope.promptProperty.dropdownSelectedItem;
      }

      if($scope.promptProperty.showInputPromptA){
        data.inputPromptA = promptControllerForm.inputPromptA.$viewValue;
      }

      if($scope.promptProperty.showDropdown &&
        _.isEmpty(data.dropdownItem) &&
        _.isEmpty(data.inputPromptA)){
        $scope.selectItemErrorMessage = true;
      }

      return data;
    }

    function setInputPromptA(status){
      if(status){
        $scope.promptProperty.showInputPromptA = true;
        $scope.promptProperty.requiredInputPromptA = true;
      }else{
        $scope.promptProperty.showInputPromptA = false;
        $scope.promptProperty.requiredInputPromptA = false;
      }
    }

    $scope.selectDropdown = function(item){
      if(_.isEqual(item, $scope.promptProperty.dividerItemName)){
        $scope.promptProperty.dropdownSelectedItem = undefined;
        setInputPromptA(true);
      }else{
        $scope.selectItemErrorMessage = false;
        $scope.promptProperty.dropdownSelectedItem = item;
        setInputPromptA(false);
      }
    };

    $scope.submit = function(promptControllerForm){
      var data = getFormVisibleData(promptControllerForm);

      // If input is invalid for drop down.
      if( _.isEmpty(data.dropdownItem) &&
        _.isEmpty(data.inputPromptA) &&
        $scope.promptProperty.showDropdown
      ) return true;

      setLoading(true);
      return $scope.success(data).then(function(response){
        if($scope.promptProperty.hideModalOnSubmit){
          $scope.$hide();
        }else{
          setPromptMessage(true, response, false);
        }
      })
      .catch(function(error){
        setPromptMessage(true, "Something went wrong " +  error.message, true);
        setLoading(false);
      })
      .finally(function(){
        setLoading(false);
        if(!_.isEmpty($scope.deferred)) $scope.deferred.resolve(data);
      });

    };

    $scope.discard = function(){
      $scope.promptProperty = {};
      setPromptMessage(false, "", false);
      return $scope.cancel().then(function(){
        $scope.$hide();
      }).finally(function(){
        if(!_.isEmpty($scope.deferred)) $scope.deferred.reject();
      });
    };

    init();
  }
]);
