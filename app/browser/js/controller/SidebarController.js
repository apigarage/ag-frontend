'use strict';

angular.module('app')

.controller('SidebarCtrl', [
  '$scope',
  '$rootScope',
  '$window',
  function ($scope, $rootScope, $window){

    $scope.selectItem = function(item, collection){
      // These assignments are used for loading the endpoint in the editor
      $rootScope.currentCollection = collection;
      $rootScope.currentItem = item;
      $rootScope.$broadcast('loadPerformRequest', item);
    };

  }
]);
