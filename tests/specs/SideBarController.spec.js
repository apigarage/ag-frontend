// 'use strict';

describe('Controller: SideBar', function() {

  var $rootScope, $scope, $controller;

  beforeEach(module('app'));

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $scope = $rootScope.$new();

    $controller('SidebarCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
    });
  }));

  describe('selectItem', function(){
    beforeEach(function(){
      collection = {
        id: 10
      };
      item = {
        uuid: 'uuid-uuid-uuid-uuid-1',
        collection_id: '2'
      };
    });

    describe('When only item value is set', function(){
      beforeEach(function(){
        $scope.selectItem(item);
      });

      it('it will set correct values', function(){
        $scope.$apply();
        expect($rootScope.currentItem.id).toEqual(item.id);
        expect($rootScope.currentCollection).not.toBeDefined();
      });
    });
    describe('When all the values are set', function(){
      beforeEach(function(){
        $scope.selectItem(item, collection);
      });

      it('it will set correct values', function(){
        $scope.$apply();
        expect($rootScope.currentItem.id).toEqual(item.id);
        expect($rootScope.currentCollection.id).toEqual(collection.id);
      });
    });
  });

});
