angular.module('app').controller('MockingResponseCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'Analytics',
  'Mocking',
  function (_, $scope, $rootScope, Analytics, Mocking){

  $scope.currentResponseBody;

  function init(){

    if($scope.agMockingResponse === undefined){
      $scope.agMockingResponse = {};
      $scope.agMockingResponse.body = '';
      $scope.deleteMockFormButton = false;
      $scope.statusCodeInput = true;
      $scope.statusCode = false;
    }else{
      $scope.deleteMockFormButton = true;
      $scope.statusCodeInput = false;
      $scope.statusCode = true;
      $scope.currentResponseBody = $scope.agMockingResponse.body;
    }
    console.log('scope', $scope);
  }

  $scope.saveMockForm = function(update){

    if($scope.agMockingResponse.uuid){
      console.log('update');
      $scope.currentResponseBody = $scope.agMockingResponse.body;
      return Mocking.update($scope.agMockingResponse);
      //  .then(function(mock){
      //    $scope.currentResponseBody = mock.body;
      //  });
    }else{
      console.log('parentEndpoint', $scope.agMockingParentEndpoint);
      Mocking.create(newItem);
      var newItem =
      {
        "uuid": "uuid-4",
        "status": $scope.agMockingResponse.statusCode,
        "body": $scope.agMockingResponse.body
      };
      $scope.agMockingResponses.push(newItem);
    }
  };

  $scope.cancelMockForm = function(mockingForm){
    console.log('cancel', $scope.currentResponse);
    $scope.agMockingResponse.body = $scope.currentResponseBody;
  };

  $scope.deleteMockForm = function(){
    console.log('delete');
    Mocking.remove($scope.agMockingResponse);
    $scope.agMockingResponses.splice($scope.agMockingResponses.activePanel, 1);
    return ;
  };

  // If form code already exists
  $scope.searchforStatusCode = function(mockingForm){
    $scope.statusCodeExists = false;
    if(mockingForm.inputStatusCode.$valid){
      if(mockingForm.inputStatusCode.$viewValue === "") return;
      for (var i = 0; i < $scope.agMockingResponses.length; i++)
      {
        if(isFound($scope.agMockingResponses[i].status, mockingForm.inputStatusCode.$viewValue)){
          // Half-baked idea: Where it would auto focus if the item exists.
          // This has list management issues
          // $scope.agMockingResponsesSearch({'search': mockingForm.inputStatusCode.$viewValue});

          $scope.statusCodeExists = true;
          mockingForm.inputStatusCode.$valid = false;
          mockingForm.inputStatusCode.$pristine = true;
        }
      }
    }
  };

  function isFound(name, search){
    var result = -1;
    try {
      result = name.toLowerCase().search(search.toLowerCase());
    } catch (e) {
      result = 0;
    }
    return (result > -1);
  }

  $scope.responseMockEditorOptions = {
    showGutter: true,
    theme: 'kuroir',
    mode: 'json',
    onLoad: function(editor){
      editor.setShowPrintMargin(false);
      editor.setShowFoldWidgets(false);
      editor.getSession().setUseWorker(false);  // Disable error checking
      editor.setHighlightActiveLine(false);
      editor.setDisplayIndentGuides(false);
      editor.setOptions({maxLines: Infinity});  // Auto adjust height!
      editor.$blockScrolling = Infinity; // Disable warning
      editor.on("focus", function(){
        $scope.responseMockEditorOptions.focused = true;
        $scope.$apply();
      });
      editor.on("blur", function(){
        $scope.responseMockEditorOptions.focused = false;
        $scope.$apply();
      });
    }
  };

  init();

}]);
