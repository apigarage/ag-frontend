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

  describe('setItem', function(){
    beforeEach(function(){
      item = {
        uuid: 'uuid-uuid-uuid-uuid-1',
        collection_id: '2'
      };
    });

    describe('When all the values are set', function(){
      beforeEach(function(){
        $scope.selectItem(item);
      });

      it('it will set correct values', function(){
        $scope.$apply();
        expect($rootScope.selectedItemUID).toBe(item.uuid);
        expect($rootScope.selectedCollectionId).toBe(item.collection_id);
      });
    });
  });

});
