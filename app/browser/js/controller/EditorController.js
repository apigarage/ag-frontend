angular.module('app').controller('EditorCtrl', [
  '$scope',
  '$http',
  '$modal',
  'RequestBuilder',
  function ($scope, $http, $modal, RequestBuilder){

    // ----------------------------
    // Temporary MOCK Endpoint Use Case
    $scope.endpoint = {
      category: "Untitled Request",
      name: "Untitled Catgetory",
      environment: 'production',
      requestMethod: 'GET',
      requestHeaders: [
        { key: "Content-Type", value: "application/json" },
        { key: "language", value: "EN" }
      ],
      requestBody: ''
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

    $scope.performRequest = function(){
      var options = {
        method: $scope.endpoint.requestMethod,
        url: $scope.endpoint.requestUrl,
        headers: $scope.endpoint.requestHeaders,
        data: $scope.endpoint.requestBody
      };
      options = RequestBuilder.buildRequest(options);
      options.transformResponse = function(data){return data;};
      $scope.response = "loading";
      return $http(options).then(function(response){
        $scope.response = response;
      })
      .catch(function(errorResponse){
        $scope.response = errorResponse;
      });

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
