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

  describe('When searching', function(){
    var collections = {
      "1": {
        "id": 1,
        "name": "Fruit",
        "items": {
          "uuid-1": {
            "id": 3,
            "uuid": "uuid-1",
            "name": "Banana"
          },
          "uuid-2": {
            "id": 5,
            "uuid": "uuid-2",
            "name": "Apple"
          },
          "uuid-5": {
            "id": 8,
            "uuid": "uuid-5",
            "name": "Grape"
          }
        }
      }
    };
    beforeEach(function(){
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
      $rootScope.currentProject.collections = collections;
      $scope.search = "Grape";
    });

    afterEach(function(){
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
    });

    it('will find values on project refresh', function(){
      $scope.$apply();
      var result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      expect(result).toBe("Grape");
    });

    it('will find values', function(){
      $scope.$apply();
      $scope.searchFilter("Grape");
      var result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      expect(result).toBe("Grape");
    });

    it('will not find values', function(){
      $scope.$apply();
      $scope.searchFilter("NotFindAnything");
      var result;
      try {
        // Fails to read the expected value because it is undefined
        result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      } catch (e) {
        result = undefined;
      }
      expect(result).toBeUndefined();
    });

    it('will return collection when search is empty', function(){
      $scope.$apply();
      $scope.searchFilter("");
      var result;
      try {
        // Fails to read the expected value because it is undefined
        result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      } catch (e) {
        result = undefined;
      }
      expect(result).toBe("Grape");
    });

    it('will return collection when search is invalid character', function(){
      $scope.$apply();
      $scope.searchFilter("+");
      var result;
      try {
        // Fails to read the expected value because it is undefined
        result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      } catch (e) {
        result = undefined;
      }
      expect(result).toBe("Grape");
    });
  });

  describe('selectItem', function(){
    beforeEach(function(){
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
      collection = {
        id: 10
      };
      item = {
        uuid: 'uuid-uuid-uuid-uuid-1',
        collection_id: '2'
      };
    });
    afterEach(function(){
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
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
