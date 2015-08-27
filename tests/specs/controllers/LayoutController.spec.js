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

    it('Application is online', function(){
      $scope.setConnectionStatus(true);
      expect($scope.online).toEqual(true);
      expect($scope.connectionStatus).toBe("Online");
    });

    it('Application is offline', function(){
      $scope.setConnectionStatus(false);
      expect($scope.online).toEqual(false);
      expect($scope.connectionStatus).toBe("Offline");
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
        $scope.toggleHistory();
        expect($scope.layout.historyMaximized).toEqual(true);
      });

      it('and when the historyMaximized value is false, it will be true',function(){
        $scope.layout.historyMaximized = true;
        $scope.toggleHistory();
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

  xit('If the current project id is invalid, redirect to projects page', function(){});
});
