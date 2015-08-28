// 'use strict';

describe('Controller: SideBar', function() {

  var $rootScope, $scope, $controller;

  beforeEach(function(){
    localStorage.clear();
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    Projects = $injector.get('Projects');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    ProjectsFixtures = $injector.get('ProjectsFixtures');

    $controller('SidebarCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
    });

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  describe('When searching', function(){
    beforeEach(function(){
      var p = ProjectsFixtures.get('searchProject');
      var pStub = ProjectsFixtures.getStub('retrieveProjectForSearch');
      HttpBackendBuilder.build(pStub.request, pStub.response);
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
      $scope.search = "Grape";
      Projects.loadProjectToRootScope(p.id);
      $httpBackend.flush();
      $scope.$apply();
    });

    afterEach(function(){
      $rootScope.currentProject = {};
      $rootScope.currentProject.collections = {};
    });

    it('will find values on project refresh', function(){
      $scope.$apply();
      var result;
      try {
        result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      } catch (e) {
        result = "Not Found";
      }
      expect(result).toBe("Grape");
    });

    it('will find values', function(){
      $scope.$apply();
      $scope.searchFilter("Grape");
      var result;
      try {
        result = $scope.searchResultsCollection[1].items['uuid-5'].name;
      } catch (e) {
        result = "Not Found";
      }
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
