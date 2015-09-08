// 'use strict';

describe('Service : Environments', function() {

  var $rootScope, $q;

  beforeEach(function(){
    localStorage.clear();
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');

    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    Projects= $injector.get('Projects');
    Environments= $injector.get('Environments');
    ProjectsFixtures = $injector.get('ProjectsFixtures');
    EnvironmentsFixtures = $injector.get('EnvironmentsFixtures');

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function(){
    $rootScope.$apply();
  });

  // // PROJECT MANAGEMENT
  describe('When project does not have any environments', function(){

    beforeEach(function(){
      p = ProjectsFixtures.get('projectEmpty');
      pStub = ProjectsFixtures.getStub('getEmptyProject');
      HttpBackendBuilder.build(pStub.request, pStub.response);

      Projects.loadProjectToRootScope(p.id);

      $httpBackend.flush();
      $rootScope.$apply();
    });

    afterEach(function(){
      $httpBackend.flush();
    });

    describe('when a new public environments is created', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('newPublicEnvironment');
        eStub = EnvironmentsFixtures.getStub('createNewPublicEnvironment');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will add the value to the rootScope', function(){
        Environments.create($rootScope.currentProject.id, environment)
          .then(function(){
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.public[environment.id]).not.toBeUndefined();
          });
      });
    });

    describe('when a new private environments is created', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('newPrivateEnvironment');
        eStub = EnvironmentsFixtures.getStub('createNewPrivateEnvironment');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will add the value to the rootScope', function(){
        Environments.create($rootScope.currentProject.id, environment)
          .then(function(){
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.private[environment.id]).not.toBeUndefined();
          });
      });
    });
  });

  describe('When project has one key', function(){
    beforeEach(function(){
      p = ProjectsFixtures.get('projectWithOneKeyOneEnvironment');
      pStub = ProjectsFixtures.getStub('getProjectWithOneKeyOneEnvironment');
      HttpBackendBuilder.build(pStub.request, pStub.response);

      Projects.loadProjectToRootScope(p.id);

      $httpBackend.flush();
      $rootScope.$apply();
    });

    afterEach(function(){
      $httpBackend.flush();
    });

    describe('when a new environment is created', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('newEnvironmentForProjectWithOneKeyOneEnvironment');
        eStub = EnvironmentsFixtures.getStub('createNewEnvironmentForProjectWithOneKeyOneEnvironment');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will add the value to the rootScope', function(){
        Environments.create($rootScope.currentProject.id, environment)
          .then(function(){
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.public[environment.id])
              .not.toBeUndefined();
          });
      });
    });

    describe('when a private environment name is updated', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('environment-private');
        eStub = EnvironmentsFixtures.getStub('updateEnvironmentPrivate');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will add the value to the rootScope', function(){
        data = {'name': environment.name + 'updated'};
        Environments.update($rootScope.currentProject.id, environment.id, data)
          .then(function(){
            // updated name in the
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.private[environment.id]).toBeDefined();
            expect($rootScope.currentProject.environments.private[environment.id].name)
              .toBe(environment.name + 'updated');
          });
      });
    });

    describe('when a public environment name is updated', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('environment-public');
        eStub = EnvironmentsFixtures.getStub('updateEnvironmentPublic');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will add the value to the rootScope', function(){
        data = {'name': environment.name + 'updated'};
        Environments.update($rootScope.currentProject.id, environment.id, data)
          .then(function(){
            // updated name in the
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.public[environment.id]).toBeDefined();
            expect($rootScope.currentProject.environments.public[environment.id].name)
              .toBe(environment.name + 'updated');
          });
      });
    });

    describe('when a private environment is deleted', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('environment-private');
        eStub = EnvironmentsFixtures.getStub('deleteEnvironmentPrivate');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will remove the value from the rootScope', function(){
        Environments.remove($rootScope.currentProject.id, environment.id)
          .then(function(){
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.private[environment.id])
              .toBeUndefined();
          });
      });
    });

    describe('when a public environment is deleted', function(){
      beforeEach(function(){
        environment = EnvironmentsFixtures.get('environment-public');
        eStub = EnvironmentsFixtures.getStub('deleteEnvironmentPublic');
        HttpBackendBuilder.build(eStub.request, eStub.response);
      });

      it('will remove the value from the rootScope', function(){
        Environments.remove($rootScope.currentProject.id, environment.id)
          .then(function(){
            expect($rootScope.currentProject.environments).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.environments.public[environment.id])
              .toBeUndefined();
          });
      });
    });

  });

});
