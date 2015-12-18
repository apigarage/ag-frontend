'use strict';

/* Services */

angular.module('app')
  .factory('Editor', [
    '$rootScope',
    '$q',
    '$window',
    '$modal',
    'lodash',
    'ApiRequest',
    'Collections',
    'Projects',
    'RequestUtility',
    'EndpointHealth',
    function($rootScope, $q, $window, $modal, _, ApiRequest, Collections,
      Projects, RequestUtility, EndpointHealth){

      /*
       * Endpoint management
       */
      var Editor = {};
      var endpoint = {};

      Editor.resetRequestChangedFlag = function(){
        Editor.requestChanged = false;
      };

      Editor.setRequestChangedFlag = function(value){
        Editor.requestChanged = value;
      };

      Editor.setEndpoint = function(updatedEndpoint){
        endpoint = updatedEndpoint;
        if( !Editor.requestChanged ) Editor.requestChanged = true;
      };

      // If item is provided, load that into the current endpoint.
      // Return current endpoint
      Editor.loadAndGetEndpoint = function(item){
        if(item){
          endpoint = buildRequestForScope(item);
        }
        return endpoint;
      };

      /*
       * Save Current Request Flow
       */
      Editor.saveOrUpdate = function( loadAfterSaving ){
        if( ! Editor.requestChanged ) return $q.resolve();

        if( loadAfterSaving === undefined || loadAfterSaving ){
          loadAfterSaving = true;
        }

        var deferred = $q.defer();

        var endpointForDB = buildRequestOutOfScope();
        console.log('endpointForDB', endpointForDB);
        if( _.isEmpty(endpointForDB.uuid) ){
          // CREATE REQUEST

          // Show modal
          var newModal = $modal(saveRequestModal());

          // so that save() function can return the promise.
          newModal.$scope.deferred = deferred;

          newModal.$scope.success = function(data){
            var promises = [];
            // Update the endpointName
            endpointForDB.name = data.name;

            // Create Collection if we have to
            var collection = data.dropdownItem;
            if( _.isEmpty(collection) ){
                var collectionBody = {
                  name: data.inputPromptA
                };
                promises.push(
                  Projects.addCollection(collectionBody)
                  .then(function(data){
                    collection = data;
                  })
                );
            }

            return $q.all(promises).then(function(){
              console.log('endpointForDB', endpointForDB);
              return Projects.addItemToCollection(collection.id, endpointForDB)
                .then(function(data){
                  // We do not have the current item loaded to controller.
                  // Let's do that.
                  if(loadAfterSaving) {
                    Editor.resetRequestChangedFlag();
                    $rootScope.$broadcast('loadPerformRequest', data, true, "EditorService");
                  }
                });
            });
          };

          newModal.$scope.cancel = function(error){
            return $q.resolve();
          };

          newModal.$promise.then( newModal.show );

        } else {
          // UPDATE REQUEST
          Projects.updateItemInCollection($rootScope.currentCollection.id, endpointForDB)
            .catch(function(data){
              Editor.resetRequestChangedFlag();
            })
            .finally(function(){
              deferred.resolve();
            });
        }

        return deferred.promise;
      };

      function saveRequestModal(){
        return {
          show: false,
          template: "html/prompt.html",
          animation: false,
          backdrop: true,
          title: "Save New Request",
          content: JSON.stringify({
            // modal window properties
            'disableCloseButton': false,
            'hideModalOnSubmit': true,

            // submit button properties
            'showSubmitButton' : true,
            'disbledSubmitButton' : false,
            'submitButtonText' : 'Save',

            // discard button properties
            'showDiscardButton' : true,
            'disbleDiscardButton' : false,
            'discardButtonText' : 'Cancel',

            // input prompt properties
            'placeHolderInputText': 'Untitled Request',
            'labelInputText': 'Request Name',
            'inputPromptText' : endpoint.name,
            'showInputPrompt' : true,
            'requiredInputPrompt' : true,

            // dropdown prompt properteis
            'showDropdown' : true,
            'dropdownItems' :  $rootScope.currentProject.collections,
            'dropdownSelectedItem' : $rootScope.currentCollection,
            'showDividerItem' : true,
            'dividerItemName' : 'New Category',
            'requiredDropDownItem' : true,
            'labelDropdownText': 'Category',

            // input prompt properties A
            'placeHolderInputTextA': 'Untitled Category',
            'labelInputTextA': 'New Category Name',
            'inputPromptTextA' : '',
            'showInputPromptA' : false,
            'requiredInputPromptA' : false,
          })
        };
      }

      /*
       * Save Current Request Flow while Changing Request
       */
      Editor.confirmSave = function(){
        if( ! Editor.requestChanged ) return $q.resolve(false);

        var deferred = $q.defer();
        var newModal = $modal(confirmSaveModal());

        // so that save() function can return the promise.
        newModal.$scope.deferred = deferred;

        newModal.$scope.success = function(data){
          return $q.resolve();
        };

        newModal.$scope.cancel = function(error){
          return $q.resolve();
        };

        newModal.$promise.then( newModal.show );

        return deferred.promise;
      };


      function confirmSaveModal(){
        return {
          show: false,
          template: "html/prompt.html",
          animation: false,
          backdrop: true,
          title: "Confirm Save Changes",
          content: JSON.stringify({
            // modal window properties
            'disableCloseButton': false,
            'promptMessage': false,
            'promptMessageText': 'You have some unsaved changes to the endpoint.' +
              ' Would you like to save current request?',
            'promptIsError': false,
            'hideModalOnSubmit': true,

            // submit button properties
            'showSubmitButton' : true,
            'disbledSubmitButton' : false,
            'submitButtonText' : 'Save',

            // discard button properties
            'showDiscardButton' : true,
            'disbleDiscardButton' : false,
            'discardButtonText' : 'Cancel',
          })
        };
      }

      /*
       * PRIVATE FUNCTIONS
       */

      function buildRequestOutOfScope(){
        var item = {};
        console.log('endpoint', endpoint);
        item.url = endpoint.requestUrl;
        item.name = endpoint.name;
        item.method = endpoint.requestMethod ;
        item.data = endpoint.requestBody;
        item.uuid = endpoint.uuid;
        item.headers = RequestUtility.getHeaders(endpoint.requestHeaders, 'object');
        item.flagged = endpoint.flagged;
        item.mocked = EndpointHealth.isMocked(endpoint.requestUrl);
        item.description = endpoint.description;

        return item;
      }

      function buildRequestForScope(item){
        var newEndpoint = {};
        newEndpoint.requestUrl = item.url;
        newEndpoint.name = item.name;

        // If method not found, set it to default method 'GET'
        newEndpoint.requestMethod  = item.method ? item.method : 'GET';
        // Flagged or resolved
        newEndpoint.flagged = ( item.flagged == 1 ? true : false );
        // Able to be mocked or not
        newEndpoint.mocked = item.mocked;
        if( newEndpoint.requestMethod !== 'GET' && _.isObject(item.data)){
          newEndpoint.requestBody = JSON.stringify(item.data);
        } else if(newEndpoint.requestMethod !== 'GET' && item.data){
          newEndpoint.requestBody = item.data;
        } else {
          newEndpoint.requestBody = "";
        }

        newEndpoint.collection_id = item.collection_id;
        newEndpoint.uuid = _.isEmpty(item.uuid) ? undefined : item.uuid;
        newEndpoint.requestHeaders = RequestUtility.getHeaders(item.headers, 'array');
        newEndpoint.description = item.description;
        newEndpoint.requestChanged = false;
        return newEndpoint;
      }

      return Editor;

    }

  ]);
