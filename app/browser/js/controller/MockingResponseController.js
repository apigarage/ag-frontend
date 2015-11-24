angular.module('app').controller('MockingResponseCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  'Analytics',
  'Mocking',
  function (_, $scope, $rootScope, Analytics, Mocking){

  $scope.currentResponseBody = "";

  function init(){

    if($scope.agMockingResponse === undefined){
      $scope.agMockingResponse = {};
      $scope.agMockingResponse.data = '';
      $scope.deleteMockFormButton = false;
      $scope.statusCodeInput = true;
      $scope.statusCode = false;
    }else{
      $scope.deleteMockFormButton = true;
      $scope.statusCodeInput = false;
      $scope.statusCode = true;
      $scope.currentResponseBody = $scope.agMockingResponse.data;
      $scope.currentResponse = $scope.agMockingResponse;
      $scope.agMockingResponse.status = parseInt($scope.agMockingResponse.status);
    }
  }

  // This reverts changes when the user switches to a different panel
  $scope.$watch('agMockingResponses.activePanel',function(){
    if($scope.agMockingResponses === undefined) return;
    $scope.agMockingResponse.data = $scope.currentResponseBody;
  });

  $scope.saveMockForm = function(mockingForm){
    $scope.loadingSaveButton = true;
    if($scope.agMockingResponse.uuid){
      return Mocking.update($scope.agMockingParentEndpoint, $scope.agMockingResponse)
       .then(function(mockResponse){
         $scope.currentResponseBody = $scope.agMockingResponse.data;
         mockingForm.inputStatusCodeResponse.$pristine = true;
         mockingForm.inputStatusCodeResponse.$dirty = false;
         $scope.loadingSaveButton = false;
       });
    }else{
      return Mocking.create($scope.agMockingParentEndpoint, $scope.agMockingResponse)
        .then(function(response){
          $scope.agMockingResponses.push(response);
          $scope.agMockingResponse = {};
          $scope.loadingSaveButton = false;
        });
    }

  };

  $scope.cancelMockForm = function(mockingForm){
    $scope.agMockingResponse.data = $scope.currentResponseBody;
  };

  $scope.deleteMockForm = function(){
    $scope.loadingDeleteButton = true;
    return Mocking.remove($scope.agMockingParentEndpoint, $scope.agMockingResponse)
      .then(function(){
        $scope.loadingDeleteButton = false;
        $scope.agMockingResponses.splice($scope.agMockingResponses.activePanel, 1);
      });
  };

  // If form code already exists
  $scope.searchforStatusCode = function(mockingForm){
    $scope.statusCodeExists = false;
    if(mockingForm.inputStatusCode.$valid){
      if(mockingForm.inputStatusCode.$viewValue === "") return;
      for (var i = 0; i < $scope.agMockingResponses.length; i++)
      {
        if($scope.agMockingResponses[i].status !== undefined &&
           isFound($scope.agMockingResponses[i].status.toString(), mockingForm.inputStatusCode.$viewValue)){

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
