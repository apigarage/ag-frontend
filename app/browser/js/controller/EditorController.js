angular.module('app').controller('EditorCtrl', [
  'lodash',
  '$scope',
  '$filter',
  '$http',
  '$sce',
  '$modal',
  'RequestUtility',
  function (_, $scope, $filter, $http, $sce, $modal, RequestUtility){

    // ----------------------------
    // Temporary MOCK Endpoint Use Case
    $scope.endpoint = {
      requestUrl: "https://www.facebook.com",
      category: "Untitled Category",
      name: "Untitled Request",
      environment: null,
      requestMethod: 'GET',
      requestHeaders: [
        { key: "Content-Type", value: "application/json" },
        { key: "language", value: "EN" }
      ],
      requestBody:  ''
    };

    $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
    $scope.environments = {
      public: [],
      publicVariables: [
        { name: '' }
      ],
      private: [],
      privateVariables: [
        { name: '' }
      ]
    };
    $scope.response = null;
    $scope.showRequestBody = false;
    $scope.responsePreviewTab = [
      { title: 'Raw',
        url: 'html/editor-response-raw.html'
      },
      { title: 'Parsed',
        url: 'html/editor-response-parsed.html'
      },
      { title: 'Preview',
        url: 'html/editor-response-preview.html'
    }];
    $scope.currentResponsePreviewTab = {
      title: 'Raw',
      url: 'html/editor-response-raw.html'
    };
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
      })
      .catch(function(errorResponse){
        $scope.response = errorResponse;
        if(errorResponse.status === 0){
          $scope.response.statusText = 'Unreachable';
          $scope.response.data = 'The URL is unreachable. Please verify:\n\n' +
          ' 1) Internet Connection.\n' +
          ' 2) HTTP vs HTTPS protocol.\n' +
          ' 3) If HTTPS, verify the certificate.\n' +
          ' 4) URL Correctness.';
        }
      })
      .finally(function(){
        // Workaround: newType Error that appears when parsing headers root casue unknown
        $scope.response.headers = JSON.parse(JSON.stringify($scope.response.headers()));
        $scope.setResponsePreviewType($scope.currentResponsePreviewTab);
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

    // Sets Response Preview Type Tab
    // Requires an JSON object with title type and url
    // and assigns response data accoringly.
    $scope.setResponsePreviewType = function(previewType){
      $scope.responsePreviewTypeContent = null;
      if( previewType.title == "Raw" ){
        $scope.currentResponsePreviewTab = previewType;
        $scope.responsePreviewTypeContent = $scope.response.data;
      }
      else if ( previewType.title == "Parsed" ){
        $scope.currentResponsePreviewTab = previewType;
        try{
          JSON.parse($scope.response.data); // checks  valid JSON
          $scope.responsePreviewTypeContent = $scope.response.data;
        }
        catch(error){
          console.log("Invalid JSON " + error.stack);
          // Will send data as is
          $scope.responsePreviewTypeContent = $scope.response.data;
        }
      }
      else if  ( previewType.title == "Preview" ){

        $scope.currentResponsePreviewTab = previewType;
        // Loading in the iframe it sandboxes the html by default
        $scope.responsePreviewTypeContent = $sce.trustAsHtml($scope.response.data);
      }
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

    $scope.responseBodyEditorOptionsRaw = {
      useWrapMode : false,
      showGutter: false,
      theme: 'kuroir',
      mode: 'text',
      onLoad: function(editor){
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(false);
        editor.setDisplayIndentGuides(false);
        editor.setOptions({maxLines: Infinity});  // Auto adjust height!
        editor.$blockScrolling = Infinity; // Disable warning
        editor.setReadOnly(true);
      }
    };

    $scope.responseBodyEditorOptionsParsed = {
      useWrapMode : true,
      showGutter: false,
      theme: 'kuroir',
      mode: 'xml',
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
