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
    function($rootScope, $q, $window, $modal, _, ApiRequest, Collections,
      Projects, RequestUtility){

      /*
       * Endpoint management
       */
      var Editor = {};
      var endpoint = {};

      Editor.resetRequestChangedFlag = function(){
        Editor.requestChanged = false;
      };

      Editor.setEndpoint = function(updatedEndpoint){
        $window.console.log('Endpoint is updated');
        endpoint = updatedEndpoint;
        if( !Editor.requestChanged ) Editor.requestChanged = true;
        $window.console.log('requestChanged', Editor.requestChanged);
      };

      Editor.resetEndpoint = function(){
        Editor.resetRequestChangedFlag();
        $window.console.log('reseting the falg endpoint');
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
      Editor.save = function(){
        if( ! Editor.requestChanged ) return $q.resolve();

        var deferred = $q.defer();

        var endpointForDB = buildRequestOutOfScope();

        if( _.isEmpty(endpointForDB.uuid) ){
          // CREATE REQUEST

          // Show modal
          var newModal = $modal({
            show: false,
            template: "html/prompt.html",
            backdrop: true,
            title: "Confirm Save Changes",
            content: saveModalRequestContent()
          });

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
              return Projects.addItemToCollection(collection.id, endpointForDB)
                .then(function(data){
                  // We do not have the current item loaded to controller.
                  // Let's do that.
                  $rootScope.$broadcast('loadPerformRequest', data);
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
              console.log(data);
            })
            .finally(function(){
              deferred.resolve();
            });
        }

        return deferred.promise;
      };

      function saveModalRequestContent(){
        return JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': false,
          'promptMessageText': 'Save Request',
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

          // input prompt properties
          'placeHolderInputText': 'Untitled Request',
          'labelInputText': 'Request Name',
          'inputPromptText' : endpoint.name,
          'showInputPrompt' : true,
          'requiredInputPrompt' : true,

          // input email prompt properties
          'placeHolderInputEmailText': 'string',
          'labelInputEmailText': 'string',
          'showInputEmailPrompt' : false,

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
        });
      }

      /*
       * Save Current Request Flow while Changing Request
       */
      Editor.saveChangedEndpoint = function(){
        $window.console.log('Should I show modal?');
        if( ! Editor.requestChanged ) return $q.resolve();
        $window.console.log('Yes');

        $window.console.log('Modal shown, selected save');
        return $q.resolve();
        // return Editor.save();
      };

      /*
       * PRIVATE FUNCTIONS
       */

      function buildRequestOutOfScope(){
        var item = {};

        item.url = endpoint.requestUrl;
        item.name = endpoint.name;
        item.method = endpoint.requestMethod ;
        item.data = endpoint.requestBody;
        item.uuid = endpoint.uuid;
        item.headers = RequestUtility.getHeaders(endpoint.requestHeaders, 'object');

        return item;
      }

      function buildRequestForScope(item){
        var newEndpoint = {};

        newEndpoint.requestUrl = item.url;
        newEndpoint.name = item.name;

        // If method not found, set it to default method 'GET'
        newEndpoint.requestMethod  = item.method ? item.method : 'GET';

        if( newEndpoint.requestMethod !== 'GET' && _.isObject(item.data)){
          newEndpoint.requestBody = JSON.stringify(item.data);
        } else if(newEndpoint.requestMethod !== 'GET' && item.data){
          newEndpoint.requestBody = item.data;
        } else {
          newEndpoint.requestBody = "";
        }
        newEndpoint.uuid = _.isEmpty(item.uuid) ? undefined : item.uuid;
        newEndpoint.requestHeaders = RequestUtility.getHeaders(item.headers, 'array');

        newEndpoint.requestChanged = false;

        return newEndpoint;
      }

      return Editor;

    }

  ]);
