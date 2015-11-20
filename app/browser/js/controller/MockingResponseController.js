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

  $scope.$watch('agMockingResponses.activePanel',function(){
    if($scope.agMockingResponses === undefined) return;
    console.log('agMockingResponses', $scope.agMockingResponses.activePanel);
    $scope.agMockingResponse.body = $scope.currentResponseBody;
  });

  $scope.saveMockForm = function(update){
    if($scope.agMockingResponse.uuid){
      console.log('update');
      $scope.currentResponseBody = $scope.agMockingResponse.body;
      return Mocking.update($scope.agMockingResponse)
      //  .then(function(mock){
      //    $scope.currentResponseBody = mock.body;
      //  });
    }else{
      console.log('parentEndpoint', $scope.agMockingParentEndpoint);
      var newItem =
      {
        "uuid": "uuid-4",
        "status": $scope.agMockingResponse.statusCode,
        "body": $scope.agMockingResponse.body
      };
      Mocking.create(newItem);
      $scope.agMockingResponses.push(newItem);
    }
    // if update
    //

    // else
    // return Mocking.create(item-uuid,data).then(function(mock){
    //  $scope.agMockingResponseCreate(mock)
    // });
  };

  $scope.cancelMockForm = function(){
    console.log('cancel', $scope.currentResponse);
    $scope.agMockingResponse.body = $scope.currentResponseBody;
  };

  $scope.deleteMockForm = function(){
    console.log('delete');
    $scope.agMockingResponses.splice($scope.agMockingResponses.activePanel, 1);
    // return Mocking.removeStatusReponse(uuid);
  };

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

  // $scope.panels = [
  //   {
  //     "title": "Collapsible Group Item #1",
  //     "body": "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch."
  //   },
  //   {
  //     "title": "Collapsible Group Item #2",
  //     "body": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
  //   },
  //   {
  //     "title": "Collapsible Group Item #3",
  //     "body": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
  //   }
  // ];
  // $scope.panels.activePanel = 1;

}]);
