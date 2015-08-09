angular.module('app').controller('EditorCtrl', [
  'lodash',
  '$scope',
  '$filter',
  '$http',
  '$modal',
  'RequestUtility',
  function (_, $scope, $filter, $http, $modal, RequestUtility){

    // ----------------------------
    // Temporary MOCK Endpoint Use Case
    $scope.endpoint = {
      requestUrl: "https://www.facebook.com",
      category: "Untitled Request",
      name: "Untitled Catgetory",
      environment: 'production',
      requestMethod: 'GET',
      requestHeaders: [
        { key: "Content-Type", value: "application/json" },
        { key: "language", value: "EN" }
      ],
      requestBody:  ''
    };

    $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
    $scope.environments = ['local', 'staging', 'production'];
    $scope.response = null;
    $scope.showRequestBody = false;
    $scope.responsePreviewTypes = ['Raw', 'Parsed', 'Preview'];
    $scope.responsePreviewType = ['Raw'];
    $scope.responsePreviewTab = [{
            title: 'Raw',
            url: 'html/editor-response-raw.html'
        }, {
            title: 'Parsed',
            url: 'html/editor-response-parsed.html'
        }, {
            title: 'Preview',
            url: 'html/editor-response-preview.html'
    }];
    $scope.responsePreviewTypeContent = null;

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
      if(method == "GET"){
        $scope.showRequestBody = false;
      }else{
        $scope.showRequestBody = true;
      }
      $scope.endpoint.requestMethod = method;
    };

    $scope.addRequestHeader = function(){
      $scope.endpoint.requestHeaders.push({});
    };

    $scope.deleteRequestHeader = function(header){
      var position = $scope.endpoint.requestHeaders.indexOf( header );
      $scope.endpoint.requestHeaders.splice(position, 1);
    };

    function resetResponse() {
      $scope.response = {
        status : -1,
        statusText : '',
        data : ''
      };
    }

    $scope.performRequest = function(){
      if( _.isEmpty($scope.endpoint.requestUrl) ) return;
      resetResponse();

      var options = {
        method: $scope.endpoint.requestMethod,
        url: $scope.endpoint.requestUrl,
        headers: $scope.endpoint.requestHeaders,
        data: $scope.endpoint.requestBody
      };
      options = RequestUtility.buildRequest(options);
      options.transformResponse = function(data){return data;};
      $scope.response = "loading";
      return $http(options).then(function(response){

        $scope.response = response;
        try{
          JSON.parse(response.data); // checks for valid JSON
          response.data = $filter('json')(response.data);
        }catch(error){
          console.log("Invalid JSON " + error.stack);
        }finally{
          $scope.response = response;
        }
        // Check which tab is Preview tab is selected
        console.log("response preview type   " + $scope.responsePreviewType);
        $scope.response = response;
      })
      .catch(function(errorResponse){
        $scope.response = errorResponse;
        if(errorResponse.status === 0){
          $scope.response.statusText = 'Unreachable';
          $scope.response.data = 'The URL is unreachable. Please verify' +
          ' 1) Internet Connection. ' +
          ' 2) HTTP vs HTTPS protocol. ' +
          ' 3) If HTTPS, verify the certificate.' +
          ' 4) URL Correctness.';
        }
      })
      .finally(function(){
        $scope.response.headers = $scope.response.headers();
        $scope.setResponsePreviewType($scope.responsePreviewType);
      });
    };

    $scope.getResponseCodeClass = function(responseCode){
      if( responseCode === undefined )
        return 'fa-spinner fa-pulse';
      else if( responseCode === 0 || responseCode >= 500 )
        return 'fa-circle icon-danger';
      else if( responseCode >= 400 )
        return 'fa-circle icon-warning';
      else
        return 'fa-circle icon-success';
    };

    $scope.setResponsePreviewType = function(previewType){
      console.log("previewType " + previewType.title);
      $scope.responsePreviewTypeContent = null;
      // reorder RAW, Parsed and Preview
      // default is RAW
      //
      if( previewType.title == "Raw" )
      {
        $scope.currentResponsePreviewTab = previewType.url;
        // RAW will output data as is
        $scope.responsePreviewTypeContent = $scope.response.data;
      }
      else if ( previewType.title == "Parsed" )
      {
        // Parsed will validate the JSON and output it.
        // remove headers
        // remove response body title
        $scope.currentResponsePreviewTab = previewType.url;
        try{
          JSON.parse($scope.response.data); // checks  valid JSON
          $scope.responsePreviewTypeContent = $scope.response.data;
        }catch(error){
          console.log("Invalid JSON " + error.stack);
          // Set tab to RAW and prevent user from parsing an invalid JSON
          // Not sure how to do this
          // $scope.responsePreviewType = ['Raw'];
        }
      }
      else if  ( previewType.title == "Preview")
      {
        $scope.currentResponsePreviewTab = previewType.url;
        // remove header
        // What is Preview? render website
        // If preview fails it should fall back on RAW Tab
      }
      $scope.responsePreviewType = previewType.title;
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
