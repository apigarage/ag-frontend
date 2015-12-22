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
  '$timeout',
  'URI',
  'marked',
  'RequestUtility',
  'History',
  'Collections',
  'Projects',
  'Editor',
  'Activities',
  'Analytics',
  'Items',
  function (_, $scope, $rootScope, $window, $filter, $http, $sce, $modal, $q,
    $focus, $timeout, URI, marked, RequestUtility, History, Collections, Projects,
    Editor, Activities, Analytics, Items){
    // Private Functions
    // ========================================================================

    function showRequestHideCancelButtons(){
      $scope.performRequestButton = true;
      $scope.cancelRequestButton = false;
    }

    function showCancelHideRequestButtons(){
      $scope.cancelRequestButton = true;
    }

    function setDefaultEndpoint(){
      $scope.endpoint = {
        flagged: false,
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

    function loadRequest(item, loadOnly, source){
      if(_.isUndefined(loadOnly)) loadOnly = true;

      $scope.loadRequestToScope(item);

      if(!loadOnly){
        $scope.performRequest(source);
      }

      return $q.resolve();
    }

    function init(){

      $scope.endpointNav = {
        tab: "Editor"
      };

      $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];

      $scope.responsePreviewTab = [
        {
          title: 'Raw',
          url: 'html/editor-response-raw.html'
        }, {
          title: 'Parsed',
          url: 'html/editor-response-parsed.html'
        // }, {
        //   title: 'Preview',
        //   url: 'html/editor-response-preview.html'
        }
      ];
      $scope.currentResponsePreviewTab = {
        title: 'Parsed',
        url: 'html/editor-response-parsed.html'
      };
      $scope.responsePreviewTypeContent = null;

      // TEMPORARY FLAG TO DISABLE THE SEARCH BOX IN THE RESPONSE PANEL
      // (note there is an extra padding created in the .response-heading
      // div to make room for the search box)
      $scope.RESPONSE_SEARCH_FLAG = false;

      $scope.isDeleteButtonDisabled = true;
      resetResponse();
      showRequestHideCancelButtons();
      setDefaultEndpoint();

      // Endpoint Health default settings
      $scope.endpointHealth = {
        isActive : false,
        urlStatus : '',
        urlMessage : {
          title: "Use Valid URI Scheme",
          content: "scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]"
        }
      };
    }

    // ========================================================================
    // Public Functions
    // ========================================================================

    $scope.requestChanged = function(){
      Editor.setEndpoint( $scope.endpoint );
      if(!$scope.requestChangedFlag){
        $scope.requestChangedFlag = true;
      }
    };

    // THIS LOGIC SHOULD NOT EXIST HERE. IT WILL BECOME PART OF SIDEBAR.
    // $scope.changeCollection = function(collection){
    //   var oldCollectionId = $rootScope.currentCollection.id;
    //   var newCollectionId = collection.id;
    //
    //   $rootScope.currentCollection = collection;
    //   if($scope.endpoint.uuid){
    //     return Projects.setNewCollectionForItem(oldCollectionId, newCollectionId, $scope.endpoint.uuid)
    //       .then(function(data){
    //         console.log('Request Updated Successfully');
    //         // Some Sort of notification would be handy.
    //       });
    //   }
    // };

    $scope.requestChanged = function(){
      Editor.setEndpoint( $scope.endpoint );
      if(!$scope.requestChangedFlag){
        $scope.requestChangedFlag = true;
      }
    };

    // Endpoint Health Checks Start
    $scope.showEndpointHealthReport = function(){
      $scope.endpointHealth.isActive = !$scope.endpointHealth.isActive;
    }

    $scope.$on('showMockedActivity', function(event, data){
      $scope.endpointHealth.isActive = data;
    });

    $scope.verifyURL = function(){
      if($scope.endpoint.requestUrl === undefined) return;
      var parsedURL = URI.parse($scope.endpoint.requestUrl);
      if(parsedURL.hostname){
        $scope.endpointHealth.urlStatus = 'fa fa-heartbeat';
      }else{
        if($scope.endpointHealth.isActive){
          $scope.endpointHealth.urlStatus = 'fa fa-exclamation-circle';
        }
      }
    }

    $scope.getEndpointHealth = function(){
      $scope.verifyURL();
      return $scope.endpointHealth.urlStatus ? $scope.endpointHealth.urlStatus : '';
    }
    // Endpoint Health Checks END

    $scope.openDeleteItemModal = function(){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        animation: false,
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
          //$scope.endpoint = {};
          setDefaultEndpoint();
          return response;
        });
    };

    $scope.isEmptyEnvironment = function(){
      return _.isEmpty($rootScope.currentProject.environments.public) &&
        _.isEmpty($rootScope.currentProject.environments.private);
    };

    $scope.setEnvironment = function(environment){
      // Analytics track environment used private v. shared
      Analytics.eventTrack('Set Environment',
        { 'from': 'EditorCtrl',
          'private': environment.private
        }
      );
      $rootScope.currentEnvironment = environment;
    };

    $scope.manageEnvironments = function(){
      var myModal = $modal({
        show: false,
        template: "html/environments.html",
        animation: false,
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
      if(!_.isEmpty(_.last($scope.endpoint.requestHeaders)) ||
        _.isEmpty($scope.endpoint.requestHeaders)){
        $scope.endpoint.requestHeaders.push({});
      }
    };

    $scope.deleteRequestHeader = function(header){
      var position = $scope.endpoint.requestHeaders.indexOf( header );
      $scope.endpoint.requestHeaders.splice(position, 1);
    };

    $scope.performRequest = function(from){
      // Number of requests made
      Analytics.eventTrack('Make Request', {'from': from});

      $scope.showResponseTab();
      $scope.loading = true;
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
      options = RequestUtility.buildRequest(options, $rootScope.currentEnvironment);
      options.transformResponse = function(data){return data;};

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

        // build the History object
        options.status = $scope.response.status;
        options.statusText = $scope.response.statusText;
        // include current item collection id and uuid to be added to history item
        options.collection_id = $scope.endpoint.collection_id ? $scope.endpoint.collection_id : undefined;
        options.uuid = $scope.endpoint.uuid ? $scope.endpoint.uuid : undefined;
        options.name = $scope.endpoint.name ? $scope.endpoint.name : undefined;

        History.setHistoryItem(options);
        $rootScope.$broadcast('updateHistory');

        // hide the cancel button and stop the make request loading
        showRequestHideCancelButtons();
        if($scope.loading) $scope.loading = false;
      });

      $scope.requestPromise = requestPromise;
      $scope.requestPromise.abort = function() {
        deferedAbort.resolve();
      };

      requestPromise.finally(function(){
        requestPromise.abort = angular.noop;
        deferedAbort = request = requestPromise = null;
      });

      return requestPromise;
    };

    $scope.cancelRequest = function(){
      showRequestHideCancelButtons();
      if($scope.loading) $scope.loading = false;
      if($scope.requestPromise) $scope.requestPromise.abort();
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
      fontFamily: 'monospace',
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
      fontFamily: 'monospace',
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
      fontFamily: 'monospace',
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
      fontFamily: 'monospace',
      onLoad: function(editor){
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(false);
        editor.setDisplayIndentGuides(false);
        editor.setOptions({maxLines: Infinity});  // Auto adjust height!
        editor.$blockScrolling = Infinity; // Disable warning
        editor.setReadOnly(true);
      }
    };

    // For empty item, set item to {}
    $scope.$on('loadPerformRequest', loadPerformRequest);
    $scope.loadPerformRequest = loadPerformRequest; // this line helps with testing.

    function loadPerformRequest(event, item, loadOnly, source, done){
      return Editor.confirmSave()
        .then(function(response){
          if(response){
            return Editor.saveOrUpdate( false );
          }
        })
        .finally(function(){

          // the way we are using it, item will always be an object.
          $rootScope.currentItem = item;

          // if item request is from history set changed flag to true
          if(_.isEqual(source,"HistoryCtrl")){
            item.existsInProject = true;
            // if the history item doesn't exist anymore in the project just load it in the editor
            if( ! $rootScope.currentProject.collections[item.collection_id] ) item.existsInProject = false;
            if( item.existsInProject && ! $rootScope.currentProject.collections[item.collection_id].items[item.uuid] ) item.existsInProject = false;

            if( ! item.existsInProject ){
              item.uuid = undefined;
            }else{
              // select the existing item
              $rootScope.currentItem = $rootScope.currentProject.collections[item.collection_id].items[item.uuid];
              $rootScope.currentCollection = $rootScope.currentProject.collections[item.collection_id];
            }

            Editor.setRequestChangedFlag(true);
            $scope.requestChangedFlag = true;
          }else{
            // if collection does not exist, it will be set to undefined.
            $rootScope.currentCollection = $rootScope.currentProject.collections[item.collection_id];
            Editor.resetRequestChangedFlag();
            $scope.requestChangedFlag = false;
          }
          return loadRequest(item, loadOnly, source)
            .then(function(){
              if(done) done();
            });
        });

    }
    /*
     * Sets the scope variables based on the request
     * @item = request item to be loaded.
     */
    $scope.loadRequestToScope = function(item){
      // TODO - Check for any previous changes. if any changes are made to the
      // previous request, ask if the user wants to save it.

      // Endpoint Health by default is set to false on load
      // $scope.endpointHealth.isActive = false;

      item.method = _.find( $scope.requestMethods, function(data){ return data === item.method; });
      $scope.endpoint = Editor.loadAndGetEndpoint(item);
      resetResponse();

      if(_.isEqual($scope.endpoint.uuid,"") || _.isUndefined($scope.endpoint.uuid)){
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
      // times "save" is used
      Analytics.eventTrack('Save Request', {'from': 'EditorCtrl'});
      return Editor.saveOrUpdate().then(function(){
        // Rest Endpoint Flags and Editor Controller button to be disabled
        Editor.resetRequestChangedFlag();
        $scope.requestChangedFlag = false;
      });
    };

    $scope.saveAsNewCurrentRequest = function(){
      // times "save as" is used
      Analytics.eventTrack('Save As New Request', {'from': 'EditorCtrl'});
      // Set current enpoint uuid to be undefined to create new save instance
      $scope.endpoint.uuid = undefined;
      return Editor.saveOrUpdate().then(function(){
        // Rest Endpoint Flags and Editor Controller button to be disabled
        Editor.resetRequestChangedFlag();
        $scope.requestChangedFlag = false;
      });
    };

    $scope.showCommentForm = function(){
      var delay = 0;
      if( $scope.endpointNav.tab != 'Activity' )
      {
        $scope.endpointNav.tab = 'Activity';
        delay = 200;
      }

      // Let the tab change sink in for a bit before sliding down.
      $timeout(function(){
        angular.element('.editor').scrollTopAnimated(1000000,2000,function(t){return t*t*t*t;});
      }, delay);
    };

    $scope.showResponseTab = function(){
      var delay = 0;
      if( $scope.endpointNav.tab != 'Editor' )
      {
        $scope.endpointNav.tab = 'Editor';
        delay = 200;
      }
    }

    $scope.addCommentFlag = function(){
      $scope.endpoint.flagged = ! $scope.endpoint.flagged;
      $scope.requestChangedFlag = true;
      var data;
      var delay = 0;
      var itemData;
      if($scope.endpoint.flagged){
        data = {
          'type' : 'flag'
        };
        itemData = {
          'flagged' : true
        };
      }else{
        data = {
          'type' : 'resolve'
        };
        itemData = {
          'flagged' : false
        };
      }

      $scope.loadingAddCommentButton = true;
      commentFlagButtonStatus(true);

      // Update the item
      return Items.update($scope.endpoint.uuid, itemData)
        .then(function(item){
          // Update current project item flagged value
          // Create a flag post
          return Activities.create($scope.endpoint.uuid, data)
            .then(function(activityItem){
            // Reload posts
            //$rootScope.$broadcast('loadActivities');
            $scope.updateActivities(activityItem);
            // Update the flag for the buttons
            $scope.updateItemFlag(item.flagged);
            // Scroll to the form
            $scope.showCommentForm();

            $scope.loadingAddCommentButton = false;
            commentFlagButtonStatus(false);
          });
        });

    };

    $scope.updateActivities = function(activityItem, action){
      $scope.activityItem = activityItem;
      $scope.action = action;
    };

    $scope.updateItemFlag = function (status){
      $scope.endpoint.flagged = status;
      // Update current project item flagged value
      $rootScope.currentProject.
        collections[$scope.endpoint.collection_id].
        items[$scope.endpoint.uuid].flagged = status ? "1" : "0";
      $rootScope.$broadcast('updateSideBar');

    };

    function commentFlagButtonStatus(state){
      $scope.commentFlagButtonStatus = state;
    }

    $scope.$watch('endpoint',function(){
      isCommentFlagButton();
    });

    function isCommentFlagButton(){
      if ($rootScope.currentItem === undefined ||
        $rootScope.currentItem.uuid === undefined)
      {
        commentFlagButtonStatus(true);
      }else{
        commentFlagButtonStatus(false);
      }
    }

    init();

  }]);
