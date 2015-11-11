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
  'Analytics',
  'ipc',
  function ($scope, $rootScope, $window, $modal, $q, _, Projects, Analytics, ipc){

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

    $scope.selectItem = function(item){
      // These assignments are used for loading the endpoint in the editor
      if(item.uuid !== $rootScope.currentItem.uuid ){
        $rootScope.$broadcast('loadPerformRequest', item, true, "SidebarCtrl");
      }
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

      if(search === ":flagged"){
        searchFlagged(temporaryCopy);
        $scope.expandGroup = true;
        return;
      }

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
          buildCollection(collection, foundItemUUID);
        }

      });
      $scope.expandGroup = true;
    };

    function searchFlagged(temporaryCopy){

      _.forEach(temporaryCopy, function(collection) {
        var foundCollection;
        var foundItemUUID = [];
        if(!_.isUndefined(collection.items)){
          _.forEach(collection.items, function(item, key) {
            if(isFlagged(item)){
              foundItemUUID.push(item.uuid);
              foundCollection = true;
            }
          });
        }

        // rebuild collection with found items
        if(foundCollection){
          buildCollection(collection, foundItemUUID);
        }

      });
    }

    function isFound(name, search){
      var result = -1;
      try {
        result = name.toLowerCase().search(search.toLowerCase());
      } catch (e) {
        result = 0;
      }
      return (result > -1);
    }

    function isFlagged(item){
      return item.flagged === "1" ? true : false;
    }

    function buildCollection(collection, foundItemUUID){
      $scope.searchResultsCollection[collection.id] = collection;
      $scope.searchResultsCollection[collection.id].items = {};
      if(!_.isEmpty(foundItemUUID)){
        _.forEach(foundItemUUID, function(uuid) {
          $scope.searchResultsCollection[collection.id].items[uuid] =
          copyOfCollection[collection.id].items[uuid];
        });
      }
    }

    $scope.newRequest = function(){
      $rootScope.$broadcast('loadPerformRequest', {}, true, "SidebarCtrl");
    };

    // get this value from localStorage?
    $scope.serverStatus = undefined;

    $scope.mockingServerSwitch = function(){
      console.log('mockingServerSwitch');
      if ($scope.serverStatus === undefined) $scope.serverStatus = false;
      // get default port
      // if server is on turn it off
      if($scope.serverStatus){
        ipc.sendSync('stop-server');
        $scope.serverStatus = false;
      }else{
        ipc.sendSync('start-server');
        $scope.serverStatus = true;
      }
      // if server is off turn it on
    };

    $scope.openRenameCollectionModal = function(currentCollection){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        animation: false,
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
        animation: false,
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
          // check to see if  currentCollction is selected collection

          // time a collection is deleted
          Analytics.eventTrack('Delete Collection', {'from': 'SidebarCtrl'});

          if($rootScope.currentCollection){
            if($rootScope.currentCollection.id == currentCollection.id){
              $rootScope.$broadcast('loadPerformRequest', {}, true, "SidebarCtrl");
            }
          }
          return response;
        });
    };

    $scope.copyItem = function(currentItem){
      currentItem.name = currentItem.name + " - Copy";
      return Projects.addItemToCollection(currentItem.collection_id, currentItem)
        .then(function(response){
          // TODO: Error handling
          return;
        });
    };

    $scope.openRenameItemModal = function(currentItem){
      var newModal = $modal({
        show: false,
        template: "html/prompt.html",
        animation: false,
        backdrop: true,
        title: "Rename Item",
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
          'placeHolderInputText': 'New Item Name',
          'labelInputText': 'Item Name',
          'inputPromptText': currentItem.name,

          // input email prompt properties
          'showInputEmailPrompt' : false,
          'requiredInputEmailPrompt': false,
        })

      });
      newModal.$scope.success = function(data){
        currentItem.name = data.name;
        return $scope.saveItemName(currentItem).then(function(response){
          return;
        });
      };
      newModal.$scope.cancel = function(error){ return $q.resolve(); };
      newModal.$promise.then( newModal.show );
      return newModal;
    };

    $scope.saveItemName = function(currentItem){
      return Projects.updateItemInCollection(currentItem.collection_id, currentItem)
        .then(function(response){
          if($rootScope.currentItem){
            if($rootScope.currentItem.uuid == currentItem.uuid){
              $rootScope.$broadcast('loadPerformRequest', currentItem, true, "SidebarCtrl");
            }
          }
          // TODO: Error handling
          return;
        });
    };

    $scope.openDeleteItemModal = function(currentCollection, currentItem){
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
          // If currentItem is selected and the item being
          // deleted is the same clear editor

          // time a request is deleted
          Analytics.eventTrack('Delete Request', {'from': 'SidebarCtrl'});

          if($rootScope.currentItem && $rootScope.currentItem.uuid == currentItem.uuid){
            $rootScope.$broadcast('loadPerformRequest', {}, true, "SidebarCtrl");
          }
          return response;
        });
    };
  }
]);
