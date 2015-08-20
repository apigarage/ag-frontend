describe('Controller: ProjectCreateOpenController', function() {
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
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  describe('Is loaded', function(){
    beforeEach(function(){
      $controller('ProjectCreateOpenCtrl', {
        $scope: $scope,
        $rootScope: $rootScope,
      });
    });

    afterEach(function(){
      $scope.$digest();
      $rootScope.$apply();
    });

    it('has no projects associated with account loads create view', function(){
      expect($scope.showCreateProject).toBe(false);
      var projectStub = ProjectsFixtures.getStub('emptyProjectList');
      HttpBackendBuilder.build(projectStub.request, projectStub.response);
      $httpBackend.flush();
      expect($scope.showCreateProject).toBe(true);
    });

    describe('has projects associated with account ', function(){
      beforeEach(function(){
        var projectStub = ProjectsFixtures.getStub('noHeadersProjectList');
        HttpBackendBuilder.build(projectStub.request, projectStub.response);
      });

      it('loads open view', function(){
        expect($scope.showOpenProject).toBe(false);
        $httpBackend.flush();
        expect($scope.showOpenProject).toBe(true);
      });

      it('create a project', function(){
        var projectStub = ProjectsFixtures.getStub('createProject');
        var projectData = ProjectsFixtures.get('projectEmpty');
        $scope.createProject.projectName = projectData.name;
        $scope.createProject.projectDescription = projectData.description;
        HttpBackendBuilder.build(projectStub.request, projectStub.response);
        $scope.createProject().then(function(){
          expect($scope.selectedProjectId).toBe(projectStub.response.data[0].id);
        });
        $httpBackend.flush();
      });

      it('create a project empty name', function(){
        var projectStub = ProjectsFixtures.getStub('createProject');
        var projectData = ProjectsFixtures.get('projectEmpty');
        $scope.createProject.projectName = "";
        $scope.createProject.projectDescription = projectData.description;
        HttpBackendBuilder.build(projectStub.request, projectStub.response);
        $scope.createProject();
        expect($scope.createProjectError).toBe(true);
      });
    });
  });
});
