angular.module('app').controller('EditorCtrl', [
  'lodash',
  '$scope',
  '$rootScope',
  '$window',
  '$filter',
  '$http',
  '$sce',
  '$modal',
  '$q',
  '$focus',
  'RequestUtility',
  'History',
  'Collections',
  'Projects',
  function (_, $scope, $rootScope, $window, $filter, $http, $sce, $modal, $q,
    $focus, RequestUtility, History, Collections, Projects){

    // Private Functions
    init();

    function showRequestHideCancelButtons(){
      $scope.performRequestButton = true;
      $scope.cancelRequestButton = false;
    }

    function showCancelHideRequestButtons(){
      $scope.performRequestButton = false;
      $scope.cancelRequestButton = true;
    }

    function setDefaultEndpoint(){
      $scope.endpoint = {
        requestUrl: "",
        name: "",
        environment: null,
        requestMethod: 'GET',
        requestHeaders: [
          { key: "Content-Type", value: "application/json" },
          { key: "language", value: "EN" }
        ],
        requestBody:  ''
      };

      $scope.collection = {
        name: 'Uncategorized (Select a Category)'
      };
    }

    function resetResponse(){
      $scope.response = null;
    }
    function init(){
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

      $scope.responsePreviewTab = [
        {
          title: 'Raw',
          url: 'html/editor-response-raw.html'
        }, {
          title: 'Parsed',
          url: 'html/editor-response-parsed.html'
        }, {
          title: 'Preview',
          url: 'html/editor-response-preview.html'
        }
      ];
      $scope.currentResponsePreviewTab = {
        title: 'Raw',
        url: 'html/editor-response-raw.html'
      };
      $scope.responsePreviewTypeContent = null;

      // TEMPORARY FLAG TO DISABLE THE SEARCH BOX IN THE RESPONSE PANEL (note there is an extra padding created in the .response-heading div to make room for the search box)
      $scope.RESPONSE_SEARCH_FLAG = false;

      // Only run this line for NEW requests. This tells the user to name the request before doing anything else.
      $focus('editor-title');

      showRequestHideCancelButtons();

      resetResponse();

      setDefaultEndpoint();
    }

    // END - Private Functions


    $scope.changeCollection = function(collection){
      var oldCollectionId = $rootScope.currentCollection.id;
      var newCollectionId = collection.id;

      $rootScope.currentCollection = collection;
      if($scope.endpoint.uuid){
        var changes = { newCollectionId : newCollectionId };
        return Projects.updateItem(oldCollectionId, $scope.endpoint.uuid, changes)
          .then(function(data){
            console.log('Request Updated Successfully');
            // Some Sort of notification would be handy.
          });
      }
    };

    $scope.openNewCategoryModal = function(){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true
      });

      newModal.$scope.title  = "New Category";
      newModal.$scope.success = $scope.saveNewCategory;
      newModal.$scope.cancel = function(error){ return $q.resolve(); };

      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.saveNewCategory = function(name){
      var data = {
        name: name,
        project_id: $rootScope.currentProject.id
      };
      return Collections.create(data)
        .then(function(collection){
          Projects.addCollection(collection);
          return $scope.changeCollection(collection);
        });
    };

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
      if(!_.isArray($scope.endpoint.requestHeaders)) {
        $scope.endpoint.requestHeaders = [];
      }
      $scope.endpoint.requestHeaders.push({});
    };

    $scope.deleteRequestHeader = function(header){
      var position = $scope.endpoint.requestHeaders.indexOf( header );
      $scope.endpoint.requestHeaders.splice(position, 1);
    };

    $scope.performRequest = function(){
      if( _.isEmpty($scope.endpoint.requestUrl) ) return;
      resetResponse();
      showCancelHideRequestButtons();
      var deferedAbort = $q.defer();
      var options = {
        method: $scope.endpoint.requestMethod,
        url: $scope.endpoint.requestUrl,
        headers: $scope.endpoint.requestHeaders,
        data: $scope.endpoint.requestBody,
        timeout: deferedAbort.promise,
      };
      History.setHistoryItem(options);
      options = RequestUtility.buildRequest(options);
      options.transformResponse = function(data){return data;};
      $rootScope.$broadcast('updateHistory');
      var requestPromise = $http(options).then(function(response){
        $scope.response = response;
      })
      .catch(function(errorResponse){
        $scope.response = errorResponse;
        if(errorResponse.status === 0){
          $scope.response.statusText = 'Unreachable';
        }
      })
      .finally(function(){
        // Workaround: newType Error that appears when parsing headers root casue unknown
        $scope.response.headers = JSON.parse(JSON.stringify($scope.response.headers()));
        $scope.setResponsePreviewType($scope.currentResponsePreviewTab);
        showRequestHideCancelButtons();
      });

      $scope.requestPromise = requestPromise;
      $scope.requestPromise.abort = function() {
        deferedAbort.resolve();
        showRequestHideCancelButtons();
      };

      requestPromise.finally(function(){
        requestPromise.abort = angular.noop;
        deferedAbort = request = requestPromise = null;
      });

      return requestPromise;
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

    // TODO: Refactor obsolete code in order to maintain tests passing.
    $scope.$watch(
      function(){
        return $rootScope.currentItem;
      },
      function(newValue, oldValue){
        // Make sure if it's valid request.
        if(newValue && newValue.url) $scope.loadRequestToScope(newValue);
      }
    );

    $rootScope.$on('loadPerformRequest', function(event, item, loadOnly) {
      if(_.isUndefined(loadOnly)) loadOnly = true;
      $scope.loadRequestToScope(item);
      if(!loadOnly) $scope.performRequest();
    });

    /*
     * Sets the scope variables based on the request
     * @item = request item to be loaded.
     */
    $scope.loadRequestToScope = function(item){
      // TODO - Check for any previous changes. if any changes are made to the
      // previous request, ask if the user wants to save it.

      $scope.endpoint = {};
      $scope.endpoint.requestUrl = item.url;
      $scope.endpoint.name = item.name;
      // Check if the method is a valid method
      item.method = _.find( $scope.requestMethods, function(data){ return data === item.method; });
      // If method not found, set it to default method 'GET'
      $scope.endpoint.requestMethod  = item.method ? item.method : 'GET';
      if( $scope.endpoint.requestMethod !== 'GET' && _.isObject(item.data)){
        $scope.endpoint.requestBody = JSON.stringify(item.data);
      } else if($scope.endpoint.requestMethod !== 'GET' && item.data){
        $scope.endpoint.requestBody = item.data;
      } else {
        $scope.endpoint.requestBody = "";
      }
      $scope.endpoint.uuid = _.isEmpty(item.uuid) ? undefined : item.uuid;
      $scope.endpoint.requestHeaders = RequestUtility.getHeaders(item.headers, 'array');
      resetResponse();
      // Collection needs to be set
    };

    /*
     * Saves the request from scope to DB.
     */
    $scope.saveCurrentRequest = function(){
      var item = $scope.buildRequestOutOfScope();
      console.log(item);
      if( _.isEmpty(item.uuid)){ // Create a request
        return; // TODO - Project.addItem() Or Project.addItemToCollection();
      } else { // Update the request
        return; // TODO - Project.updateItem() Or Project.updateItemToCollection();
      }
    };

    /*
     * Builds the request object (to be saved) using scope.
     * Returns the request object.
     */
    $scope.buildRequestOutOfScope = function(){
      var item = {};
      item.url = $scope.endpoint.requestUrl;
      item.name = $scope.endpoint.name;
      item.method = $scope.endpoint.requestMethod ;
      item.data = $scope.endpoint.requestBody;
      item.uuid = $scope.endpoint.uuid;
      item.headers = RequestUtility.getHeaders($scope.endpoint.requestHeaders, 'string');
      return item;
    };
  }]);
