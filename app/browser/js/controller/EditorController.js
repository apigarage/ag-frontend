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
        requestMethod: 'GET',
        requestHeaders: [
          { key: "Content-Type", value: "application/json" }
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

    function resetErrorMessages(){
      $scope.showCategoryMissingErrorMessage = false;
    }

    function resetRequestChanged(){
      $scope.requestChangedFlag = false;
    }

    function init(){
      $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];

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

      $scope.isDeleteButtonDisabled = true;
      resetErrorMessages();
      resetResponse();
      showRequestHideCancelButtons();
      setDefaultEndpoint();
      resetRequestChanged();
    }

    // END - Private Functions

    $scope.requestChanged = function(){
      if(!$scope.requestChangedFlag){
        $scope.requestChangedFlag = true;
      }
    };

    $scope.copyCurrentRequest = function(){
      // This should never happen. If it happens, just in case, the current request is its own copy.
      if(!$scope.endpoint.uuid) return;

      var newItem = $scope.endpoint;
      newItem.uuid = undefined;
      newItem.name = newItem.name + ' Copy';

      newItem = $scope.buildRequestOutOfScope();
      return Projects.addItemToCollection($rootScope.currentCollection.id, newItem)
        .then(function(item){
          $rootScope.currentItem = item;
          $rootScope.$broadcast('loadPerformRequest', item);
        });
    };

    $scope.changeCollection = function(collection){
      var oldCollectionId = $rootScope.currentCollection.id;
      var newCollectionId = collection.id;
      $scope.showCategoryMissingErrorMessage = false;

      $rootScope.currentCollection = collection;
      if($scope.endpoint.uuid){
        return Projects.setNewCollectionForItem(oldCollectionId, newCollectionId, $scope.endpoint.uuid)
          .then(function(data){
            console.log('Request Updated Successfully');
            // Some Sort of notification would be handy.
          });
      }
    };

    $scope.openNewCategoryModal = function(){
      var modalContent = {
        // modal window properties
        'disableCloseButton': false,
        'promptMessage': false,
        'promptMessageText': 'Add Category Message: ',
        'promptIsError': false,
        'hideModalOnSubmit': true,

        // submit button properties
        'showSubmitButton' : true,
        'disbledSubmitButton' : false,
        'submitButtonText' : 'Add',

        // discard button properties
        'showDiscardButton' : true,
        'disbleDiscardButton' : false,
        'discardButtonText' : 'Cancel',

        // input prompt properties
        'showInputPrompt' : true,
        'requiredInputPrompt' : true,
        'placeHolderInputText': 'New Category Name',
        'labelInputText': 'Add New Category',

        // input email prompt properties
        'showInputEmailPrompt' : false,
        'requiredInputEmailPrompt': false,
        'placeHolderInputEmailText': '',
        'labelInputEmailText': ''
      };

      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true,
        title: "New Category",
        content: JSON.stringify(modalContent)
      });
      newModal.$scope.success = $scope.saveNewCategory;
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.saveNewCategory = function(data){
      data.project_id = $rootScope.currentProject.id;
      return Collections.create(data)
        .then(function(collection){
          Projects.addCollection(collection);
          return $scope.changeCollection(collection);
        });
    };

    $scope.openDeleteItemModal = function(){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true,
        title: "Delete Item",
        content: JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': true,
          'promptMessageText': $rootScope.currentItem.name,
          'promptIsError': true,
          'hideModalOnSubmit': true,

          // submit button properties
          'showSubmitButton' : true,
          'disbledSubmitButton' : false,
          'submitButtonText' : 'Confirm',

          // discard button properties
          'showDiscardButton' : true,
          'disbleDiscardButton' : false,
          'discardButtonText' : 'Cancel',

          // input prompt properties
          'showInputPrompt' : false,
          'requiredInputPrompt' : false,

          // input email prompt properties
          'showInputEmailPrompt' : false,
          'requiredInputEmailPrompt': false,
        })

      });
      newModal.$scope.success = $scope.deleteItem;
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.deleteItem = function(){
      return Projects.removeItemFromCollection($rootScope.currentCollection.id, $rootScope.currentItem.uuid)
        .then(function(response){
          // TODO: Error handling
          $scope.endpoint = {};
          return response;
        });
    };

    $scope.isEmptyEnvironment = function(){
      return _.isEmpty($rootScope.currentProject.environments.public) &&
        _.isEmpty($rootScope.currentProject.environments.private);
    };

    $scope.setEnvironment = function(environment){
      $rootScope.currentEnvironment = environment;
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
      options = RequestUtility.buildRequest(options, $rootScope.currentEnvironment);
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
      $scope.currentResponsePreviewTab = previewType;

      if( previewType.title == "Raw" ){
        $scope.responsePreviewTypeContent = $scope.response.data;
      }
      else if ( previewType.title == "Parsed" ){
        try{
          $scope.responsePreviewTypeContent = $filter('json')( JSON.parse($scope.response.data ) );
        }
        catch(error){
          console.log("Invalid JSON " + error.stack);
          // Will send data as is
          $scope.responsePreviewTypeContent = $scope.response.data;
        }
      }
      else if  ( previewType.title == "Preview" ){
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

    $rootScope.$on('loadPerformRequest', function(event, item, loadOnly) {

      if( $scope.requestChangedFlag && item.uuid !== $scope.endpoint.uuid ){

        var modalContent = {
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': true,
          'promptMessageText': 'You have made changes to the endpoint. Would you like to save?',
          'promptIsError': true,
          'hideModalOnSubmit': true,

          // submit button properties
          'showSubmitButton' : true,
          'disbledSubmitButton' : false,
          'submitButtonText' : 'Save Current Endpoint',

          'showDiscardButton' : true,
          'disbleDiscardButton' : false,
          'discardButtonText' : 'Continue without editing',

          // input prompt properties
          'showInputPrompt' : false,
          'requiredInputPrompt' : false,
          'placeHolderInputText': '',
          'labelInputText': '',

          // input email prompt properties
          'showInputEmailPrompt' : false,
          'requiredInputEmailPrompt': false,
          'placeHolderInputEmailText': '',
          'labelInputEmailText': ''
        };

        var newModal = $modal({
          show: false,
          template: "html/prompt.html",
          backdrop: true,
          title: "Confirm Changing Endpoint",
          content: JSON.stringify(modalContent)
        });

        newModal.$scope.success = function(){
          return $scope.saveCurrentRequest()
            .then(function(){
              return loadRequest(item, loadOnly);
            });
        };

        newModal.$scope.cancel = function(){
          loadRequest(item, loadOnly);
        };

        newModal.$promise.then( newModal.show );

        return newModal;
      }

      // If current request is being loaded
      // if(item && item.uuid === $scope.endpoint.uuid ){

      // If empty item is being loaded on the initial rendering
      // if(! (item && item.name) ) {

      // If old item is not changed
      // if(!$scope.requestChangedFlag){

      loadRequest(item, loadOnly);
      return $q.resolve();
    });

    function loadRequest(item, loadOnly){
      if(_.isUndefined(loadOnly)) loadOnly = true;

      resetRequestChanged();

      $rootScope.currentItem = item;
      $scope.loadRequestToScope(item);

      if(!loadOnly){
        $scope.performRequest();
      }

      return $q.resolve();
    }

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

      if(_.isEqual($scope.endpoint.name,"") || _.isUndefined($scope.endpoint.name)){
        $scope.isDeleteButtonDisabled = true;
      }else{
        $scope.isDeleteButtonDisabled = false;
      }
      // Collection needs to be set
    };

    /*
     * Saves the request from scope to DB.
     */
    $scope.saveCurrentRequest = function(){
      resetErrorMessages();
      if(_.isEmpty($rootScope.currentCollection)){
        $scope.showCategoryMissingErrorMessage = true;
        $q.reject();
      }
      if(_.isEmpty($scope.endpoint.name)){
        $focus('editor-title');
        $q.reject();
      }

      var item = $scope.buildRequestOutOfScope();
      var promise = null;

      if( _.isEmpty(item.uuid) ){ // Create a request
        promise = Projects.addItemToCollection($rootScope.currentCollection.id, item);
      } else { // Update the request
        promise = Projects.updateItemInCollection($rootScope.currentCollection.id, item);
      }

      return promise.then(function(item){
        $rootScope.currentItem = item;
        $rootScope.$broadcast('loadPerformRequest', item);
      });
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
      item.headers = RequestUtility.getHeaders($scope.endpoint.requestHeaders, 'object');
      return item;
    };
  }]);
