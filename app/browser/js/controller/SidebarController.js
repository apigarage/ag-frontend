'use strict';

angular.module('app')

.controller('SidebarCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  function ($scope, $rootScope, $window){

    $scope.selectItem = function(item){
      // Used for highlighting the currently selected item
      $rootScope.selectedItemUID = item.uuid;
      $rootScope.selectedCollectionId = item.collection_id;

      // Used for loading the endpoint the editor
      $rootScope.currentItem = item;
    };

  }
]);
