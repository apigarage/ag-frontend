angular.module('app').controller('EditorCtrl', [
  '$scope',
  '$timeout',
  '$http',
  '$modal',
  function ($scope, $timeout, $http, $modal){

    // ----------------------------
    // Temporary MOCK Endpoint Use Case
    $scope.endpoint = {
      category: "Albums",
      name: "Get an Artist's Tracks",
      environment: 'production',
      requestMethod: 'GET',
      requestHeaders: [
        { key: "Content-Type", value: "application/json" },
        { key: "language", value: "EN" }
      ],
      requestBody: '{\n    "amount": "32.32",\n    "status": true\n}'
    };
    $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
    $scope.environments = ['local', 'staging', 'production'];
    $scope.response = null;
    $scope.responsePreviewTypes = ['Parsed', 'Raw', 'Preview'];
    $scope.responsePreviewType = ['Parsed'];

    $scope.setEnvironment = function(environment){
      $scope.endpoint.environment = environment;
    };

    $scope.manageEnvironments = function(){
      var myModal = $modal({
        show: false,
        template: "html/environments.html",
        backdrop: true
      });

      myModal.$scope.environments  = $scope.environments;
      myModal.$promise.then( myModal.show );
    };

    $scope.setRequestMethod = function(method){
      $scope.endpoint.requestMethod = method;
    };

    $scope.addRequestHeader = function(){
      $scope.endpoint.requestHeaders.push({});
    };

    $scope.deleteRequestHeader = function(header){
      var position = $scope.endpoint.requestHeaders.indexOf( header );
      $scope.endpoint.requestHeaders.splice(position, 1);
    };

    // ----------------------------
    // Temporary MOCK Responses
    var randomRequestIndex = 1;
    //$scope.response = sampleResponses[1];
    $scope.performRequest = function(){
      console.log($scope.endpoint);
      $scope.response = "loading";

      $http.get($scope.endpoint.requestUrl).then(function(data){
        $scope.response = data;
      })
      .catch(function(err){
        console.log(err);
      });

      // Randomly return one of the sample responses (declared at the bottom of the page)
      $timeout(function(){  // Emulate async
      }, 500);
    };

    $scope.getResponseCodeClass = function(responseCode){
      if( !responseCode )
      return 'fa-spinner fa-pulse';
      else if( responseCode >= 500 )
      return 'fa-circle icon-danger';
      else if( responseCode >= 400 )
      return 'fa-circle icon-warning';
      else
      return 'fa-circle icon-success';
    };

    $scope.setResponsePreviewType = function(previewType){
      $scope.responsePreviewType = previewType;
    };

    $scope.requestBodyEditorOptions = {
      showGutter: false,
      theme: 'kuroir',
      mode: 'json',
      onLoad: function(editor){
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(false);
        editor.setDisplayIndentGuides(false);
        editor.setOptions({maxLines: Infinity});  // Auto adjust height!
        editor.$blockScrolling = Infinity; // Disable warning
      }
    };

    $scope.responseBodyEditorOptions = {
      showGutter: false,
      theme: 'kuroir',
      mode: 'json',
      onLoad: function(editor){
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(false);
        editor.setDisplayIndentGuides(false);
        editor.setOptions({maxLines: Infinity});  // Auto adjust height!
        editor.$blockScrolling = Infinity; // Disable warning
        editor.setReadOnly(true);
      }
    };

  }]);
