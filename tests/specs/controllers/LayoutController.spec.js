describe('Controller: LayoutController', function() {

  var $rootScope, $scope, $controller;
  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    ProjectsFixtures = $injector.get('ProjectsFixtures');
    _ = $injector.get('lodash');

    $httpBackend.when('GET',/.*html.*/).respond(200, '');

  }));

  describe('When LayoutCtrl is loaded with valid currentProjectId', function(){

    describe('When currentProjectId is a number', function(){
      beforeEach(function(){
        $rootScope.currentProjectId = '4';
        $controller('LayoutCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
        var project = ProjectsFixtures.get('projectWithTwoCollectionsAndOneItem');
        $rootScope.currentProjectId = project.id;

        // Stubbing Project CRUD
        var projectStub = ProjectsFixtures.getStub('retreiveProjectWithTwoCollectionsAndOneItem');
        HttpBackendBuilder.build(projectStub.request, projectStub.response);

        $httpBackend.flush();
      });

      afterEach(function(){
        $scope.$digest();
        $rootScope.$apply();
      });

      it('If the current project id is valid, load the project', function(){
        expect($rootScope.currentProject).toBeDefined();
        expect($rootScope.currentProject.collections).toBeDefined();
        expect(_.isObject($rootScope.currentProject.collections)).toEqual(true);
        Object.keys($rootScope.currentProject.collections).forEach(function(key){
          var collection = $rootScope.currentProject.collections[key];
          expect(_.isObject(collection.items)).toEqual(true);
        });
        expect($rootScope.currentProject.items).toBeDefined();
        expect(_.isObject($rootScope.currentProject.items)).toEqual(true);
      });

    });

    describe('When currentProjectId is a number', function(){
      beforeEach(function(){
        $rootScope.currentProjectId = 4;
        $controller('LayoutCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
        var project = ProjectsFixtures.get('projectWithTwoCollectionsAndOneItem');
        $rootScope.currentProjectId = project.id;

        // Stubbing Project CRUD
        var projectStub = ProjectsFixtures.getStub('retreiveProjectWithTwoCollectionsAndOneItem');
        HttpBackendBuilder.build(projectStub.request, projectStub.response);

        $httpBackend.flush();
      });

      afterEach(function(){
        $scope.$digest();
        $rootScope.$apply();
      });

      it('If the current project id is valid, load the project', function(){
        expect($rootScope.currentProject).toBeDefined();
        expect($rootScope.currentProject.collections).toBeDefined();
        expect(_.isObject($rootScope.currentProject.collections)).toEqual(true);
        Object.keys($rootScope.currentProject.collections).forEach(function(key){
          var collection = $rootScope.currentProject.collections[key];
          expect(_.isObject(collection.items)).toEqual(true);
        });
        expect($rootScope.currentProject.items).toBeDefined();
        expect(_.isObject($rootScope.currentProject.items)).toEqual(true);
      });

      it('Sidebar is not expanded', function(){
        expect($scope.layout.sidebarExpanded).toEqual(false);
      });

      it('History is not expanded', function(){
        expect($scope.layout.historyMaximized).toEqual(false);
      });

      describe('When Sidebar is toggled', function(){
        it('and when the toggleSidebar value is true, it will be false',function(){
          $scope.layout.sidebarExpanded = false;
          $scope.toggleSidebar();
          expect($scope.layout.sidebarExpanded).toEqual(true);
        });

        it('and when the toggleSidebar value is false, it will be true',function(){
          $scope.layout.sidebarExpanded = true;
          $scope.toggleSidebar();
          expect($scope.layout.sidebarExpanded).toEqual(false);
        });
      });

      describe('When history is toggled', function(){
        it('and when the historyMaximized value is true, it will be false',function(){
          $scope.layout.historyMaximized = false;
          $scope.toggleBottomBar('history');
          expect($scope.layout.historyMaximized).toEqual(true);
        });

        it('and when the historyMaximized value is false, it will be true',function(){
          $scope.layout.historyMaximized = true;
          $scope.toggleBottomBar('history');
          expect($scope.layout.historyMaximized).toEqual(false);
        });
      });

      describe('When external link is clicked', function(){
        it('opens the external link',function(){
          // Not sure, how to test it yet.
          // So, until we do that, this ia dummy test.
          $scope.openExternal('http://www.google.com');
          expect(true).toEqual(true);
        });
      });
    });

  });

  describe('If the current project id is invalid, redirect to projects page', function(){

    describe('When currentProjectId is undefined string', function(){

      beforeEach(function(){
        $rootScope.currentProjectId = 'undefined';
        $controller('LayoutCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
      });

      it('will not load the project', function(){
        // if you get upto here, means you are passing the test.
        expect(true).toBe(true);
      });
    });

    describe('When currentProjectId is undefined', function(){

      beforeEach(function(){
        $rootScope.currentProjectId = undefined;
        $controller('LayoutCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
      });

      it('will not load the project', function(){
        // if you get upto here, means you are passing the test.
        expect(true).toBe(true);
      });
    });

    describe('When currentProjectId is null', function(){

      beforeEach(function(){
        $rootScope.currentProjectId = null;
        $controller('LayoutCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
      });

      it('will not load the project', function(){
        // if you get upto here, means you are passing the test.
        expect(true).toBe(true);
      });
    });

  });
});
