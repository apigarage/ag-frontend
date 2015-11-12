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
    Mocking = $injector.get('Mocking');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    ProjectsFixtures = $injector.get('ProjectsFixtures');
    ItemsFixtures = $injector.get('ItemsFixtures');
    CollectionsFixtures = $injector.get('CollectionsFixtures');

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

  describe('When using Mocking Server', function(){
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

    it('will be able to start', function(){
      $scope.mockingServerSwitch(); // switch on
      expect($scope.serverStatus).toBe(true);
      $scope.mockingServerSwitch(); // switch off
    });

    it('will be able to stop', function(){
      $scope.mockingServerSwitch(); // switch on
      $scope.mockingServerSwitch(); // switch off
      expect($scope.serverStatus).toBe(false);
    });

  });

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
      $rootScope.currentItem = {};
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

  });

  describe('openDeleteItemModal', function(){
    var modalDeleteItem;
    beforeEach(function(){
      collection = CollectionsFixtures.get('collectionWithTwoItems');
      $rootScope.currentCollection = collection;
      item = ItemsFixtures.get('item1');
      modalDeleteItem = $scope.openDeleteItemModal(collection,item);
    });
    it('will open new delete modal', function(){
      expect(modalDeleteItem.$scope.success).toBeDefined();
      expect(modalDeleteItem.$scope.cancel).toBeDefined();
    });
  });

  describe('openRenameCollectionModal', function(){
    var modalRenameCollection;
    beforeEach(function(){
      $rootScope.currentCollection = {"name": "itemName"};
      modalRenameCollection = $scope.openRenameCollectionModal({"name": "itemName"});
    });
    it('will open new delete modal', function(){
      expect(modalRenameCollection.$scope.success).toBeDefined();
      expect(modalRenameCollection.$scope.cancel).toBeDefined();
    });
  });

  describe('openDeleteCollectionModal', function(){
    var modalDeleteCollection;
    beforeEach(function(){
      $rootScope.currentCollection = {"id": 1, "name": "collectionName"};
      modalDeleteCollection = $scope.openDeleteCollectionModal($rootScope.currentCollection);
    });
    it('will open new delete modal', function(){
      expect(modalDeleteCollection.$scope.success).toBeDefined();
      expect(modalDeleteCollection.$scope.cancel).toBeDefined();
    });
  });

  describe('deleteItemCollection', function(){

    beforeEach(function(){
      project = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
      $rootScope.currentProject = project;

      createStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
      HttpBackendBuilder.build(createStub.request, createStub.response);
      Projects.loadProjectToRootScope(project.id);

      item = ItemsFixtures.get('item1');
      $rootScope.$broadcast('loadPerformRequest', item);

      createItemsStub = ItemsFixtures.getStub('deleteItemId');
      HttpBackendBuilder.build(createItemsStub.request, createItemsStub.response);

      spyOn($rootScope, '$broadcast').and.callThrough();
    });

    it('will delete item.collection_id on the server and locally.', function(){
      var collection = $rootScope.currentCollection = CollectionsFixtures.get('collectionWithTwoItems');
      $rootScope.currentItem = item;
      expect($rootScope.currentItem.uuid).toBeDefined();
      $scope.deleteItem(collection, item);
      $httpBackend.flush();
      expect($rootScope.currentProject.collections[collection.id].items[item.uuid]).toBeUndefined();
      expect($rootScope.$broadcast).toHaveBeenCalled();
    });
  });

  describe('deleteCollection', function(){
    var collectionID;
    var project;
    beforeEach(function(){
      createCollectionsStub = CollectionsFixtures.getStub('deleteCollection');
      HttpBackendBuilder.build(createCollectionsStub.request, createCollectionsStub.response);
      //$rootScope.currentCollection = CollectionsFixtures.get('collectionWithNoItemsZero');
      collection = CollectionsFixtures.get('collectionWithNoItemsZero');
      $rootScope.currentProject = {collections: [collection] };
    });
    it('will delete collection_id on the server and locally.', function(){
      $scope.deleteCategory(collection).then(function(){
        expect($rootScope.currentProject.collections[collection.id]).toBeUndefined();
      });
      $httpBackend.flush();
    });
  });

  describe('renameCollection', function(){
    beforeEach(function(){
      project = ProjectsFixtures.get('projectWithTwoCollectionNoItems');
      collection = CollectionsFixtures.get('collectionWithTwoItems');
      createCollectionStub = CollectionsFixtures.getStub('renameCollection');
      HttpBackendBuilder.build(createCollectionStub.request, createCollectionStub.response);
    });

    it('will save name of collection on the server and locally.', function(){
      $rootScope.currentProject = project;
      $rootScope.currentProject.collections[collection.id] = collection;
      $scope.saveCategory(collection,{"name":"newCollectionName"}).then(function(){
        expect($rootScope.currentProject.collections[collection.id].name).toBe("newCollectionName");
      });
      $httpBackend.flush();
    });
  });
});
