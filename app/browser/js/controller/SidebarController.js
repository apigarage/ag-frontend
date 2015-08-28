'use strict';

angular.module('app')

.controller('SidebarCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  'lodash',
  function ($scope, $rootScope, $window, _){

    var copyOfCollection = {};
    $scope.searchResultsCollection = {};
    $scope.search = "";

    // TODO: Could probably use a broadcast from the Projects Services
    // and receive the collection here
    $scope.$watch(
      function(){
        return $rootScope.currentProject.collections;
      },
      function(collection){
        copyOfCollection = angular.copy( $rootScope.currentProject.collections, $scope.searchResultsCollection);
        if(!_.isEmpty($scope.search)){
          $scope.searchFilter($scope.search);
        }
      }
    );

    $scope.selectItem = function(item, collection){
      // These assignments are used for loading the endpoint in the editor
      $rootScope.currentCollection = collection;
      $rootScope.currentItem = item;
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

  }
]);
