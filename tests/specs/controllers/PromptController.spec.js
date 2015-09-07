describe('Controller: PromptController', function() {

  var $rootScope, $scope, $controller, $q;

  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    RequestUtility = $injector.get('RequestUtility');
    $q = $injector.get('$q');

    // Stubbing Scope Methods
    $scope.success = function(){
      return $q.resolve();
    };
    $scope.cancel = function(){
      return $q.resolve();
    };
    $scope.$hide = function(){
      return true;
    };

    $scope.content = JSON.stringify({
      // Submit Modal Type
      'modalType': 'shareProject',
      // modal window properties
      'disableCloseButton': false,
      'promptMessage': false,
      'promptMessageText': '',
      'promptIsError': false,

      // submit button properties
      'showSubmitButton' : true,
      'disbledSubmitButton' : false,
      'submitButtonText' : 'Share',

      // discard button properties
      'showDiscardButton' : true,
      'disbleDiscardButton' : false,
      'discardButtonText' : 'Cancel',

      // input prompt properties
      'showInputPrompt' : false,
      'requiredInputPrompt' : false,
      'placeHolderInputText': '',
      'labelInputText': '',

      // input email prompt properties
      'showInputEmailPrompt' : true,
      'requiredInputEmailPrompt': true,
      'placeHolderInputEmailText': 'Email Address',
      'labelInputEmailText': null
    });

    // Creating controller
    $controller('PromptCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
    });

      // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function(){
    $scope.$digest();
    $rootScope.$apply();
  });
  describe('On Load', function(){
    it('will not show any prompt messages', function(){
      expect($scope.promptProperty.promptMessage).toBe(false);
      expect($scope.promptProperty.promptMessageText).toBe("");
      expect($scope.promptProperty.promptIsError).toBe(false);
    });
  });

  xdescribe('On Success', function(){
    describe('when invalid name provided', function(){
      it('will show an error message', function(){
        $scope.input = "";
        $scope.submit();
        expect($scope.inputError).toBe(true);
        expect($scope.inputErrorMessage).toBe("Input cannot be blank.");
      });
    });
    describe('when valid name provided', function(){
      it('will show no error message', function(){
        $scope.input = "some-input";
        $scope.submit().then(function(){
          expect($scope.inputError).toBe(false);
          expect($scope.inputErrorMessage).toBe("");
        });
      });
    });
  });

  describe('On Discard', function(){
    describe('When the prompt is discarded', function(){
      it('it will empty errors and close the modal', function(){
        $scope.discard().then(function(){
          expect($scope.promptProperty.promptMessage).toBe(false);
          expect($scope.promptProperty.promptMessageText).toBe("");
          expect($scope.promptProperty.promptIsError).toBe(false);
        });
      });
    });
  });



});
