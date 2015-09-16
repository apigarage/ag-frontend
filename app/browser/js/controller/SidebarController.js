'use strict';

angular.module('app')

.controller('SidebarCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  '$modal',
  '$q',
  'lodash',
  'Projects',
  function ($scope, $rootScope, $window, $modal, $q, _, Projects){

    var copyOfCollection = {};
    $scope.searchResultsCollection = null;
    $scope.search = "";

    // Braodcast Receiver to update the sidebar contents.
    // This is leverged by any Services that modifies the Project Colleciton
    $scope.$on('updateSideBar', function(event) {
      $scope.searchResultsCollection = null;
      if( _.isEmpty($rootScope.currentProject) ) return;
      copyOfCollection = angular.copy($rootScope.currentProject.collections);
      $scope.searchResultsCollection = angular.copy($rootScope.currentProject.collections);

      if(!_.isEmpty($scope.search)){
        $scope.searchFilter($scope.search);
      }
    });

    $scope.selectItem = function(item, collection){
      // These assignments are used for loading the endpoint in the editor
      $rootScope.$broadcast('loadPerformRequest', item);
    };

    $scope.searchFilter = function (search){
      var temporaryCopy ={};
      // if we use collectionOfCopy in the forEach it does some wonky things.
      angular.copy(copyOfCollection, temporaryCopy);
      if(_.isEmpty(search)){
        angular.copy(temporaryCopy, $scope.searchResultsCollection);
        return;
      }
      $scope.searchResultsCollection = {};
      _.forEach(temporaryCopy, function(collection) {
        var foundCollection = isFound(collection.name,search);
        var foundItemUUID = [];
        if(!_.isUndefined(collection.items)){
          _.forEach(collection.items, function(item, key) {
            if(isFound(item.name,search)){
              foundItemUUID.push(item.uuid);
              foundCollection = true;
            }
          });
        }
        // rebuild collection with found items
        if(foundCollection){
          $scope.searchResultsCollection[collection.id] = collection;
          $scope.searchResultsCollection[collection.id].items = {};
          if(!_.isEmpty(foundItemUUID)){
            _.forEach(foundItemUUID, function(uuid) {
              $scope.searchResultsCollection[collection.id].items[uuid] =
              copyOfCollection[collection.id].items[uuid];
            });
          }
        }
      });
      $scope.expandGroup = true;
    };

    function isFound(name, search){
      var result = -1;
      try {
        result = name.toLowerCase().search(search.toLowerCase());
      } catch (e) {
        result = 0;
      }
      return (result > -1);
    }

    $scope.newRequest = function(){
      $rootScope.$broadcast('loadPerformRequest', {});
      $rootScope.currentCollection = {};
      $rootScope.currentItem = {};
    };

    $scope.openRenameCollectionModal = function(currentCollection){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true,
        title: "Rename Collection",
        content: JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': false,
          'promptMessageText': '',
          'promptIsError': false,
          'hideModalOnSubmit': true,

          // submit button properties
          'showSubmitButton' : true,
          'disbledSubmitButton' : false,
          'submitButtonText' : 'Rename',

          // discard button properties
          'showDiscardButton' : true,
          'disbleDiscardButton' : false,
          'discardButtonText' : 'Cancel',

          // input prompt properties
          'showInputPrompt' : true,
          'requiredInputPrompt' : true,
          'placeHolderInputText': 'New Collection Name',
          'labelInputText': 'Collection Name',
          'inputPromptText': currentCollection.name,

          // input email prompt properties
          'showInputEmailPrompt' : false,
          'requiredInputEmailPrompt': false,
        })

      });
      newModal.$scope.success = function(data){
        return $scope.saveCategory(currentCollection,data).then(function(response){
          return;
        });
      };
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.saveCategory = function(currentCollection,data){
      return Projects.updateCollection(currentCollection, data)
        .then(function(response){
          // TODO: Error handling
          return;
        });
    };

    $scope.openDeleteCollectionModal = function(currentCollection){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true,
        title: "Delete Collection",
        content: JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': true,
          'promptMessageText': currentCollection.name,
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
      newModal.$scope.success = function(){
        return $scope.deleteCategory(currentCollection)
        .then(function(response){
          // TODO: Error handling
          return response;
        });
      };
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.deleteCategory = function(currentCollection){
      return Projects.removeCollection(currentCollection)
        .then(function(response){
          // TODO: Error handling
          return response;
        });
    };

    $scope.openDeleteItemModal = function(currentCollection, currentItem){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        backdrop: true,
        title: "Delete Item",
        content: JSON.stringify({
          // modal window properties
          'disableCloseButton': false,
          'promptMessage': true,
          'promptMessageText': currentItem.name,
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
      newModal.$scope.success = function(){
        return $scope.deleteItem(currentCollection, currentItem)
        .then(function(response){
          // TODO: Error handling
          return response;
        });
      };
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.deleteItem = function(currentCollection, currentItem){
      return Projects.removeItemFromCollection(currentCollection.id, currentItem.uuid)
        .then(function(response){
          // TODO: Error handling
          return response;
        });
    };

  }
]);
