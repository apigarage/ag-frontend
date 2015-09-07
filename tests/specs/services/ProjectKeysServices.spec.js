// 'use strict';

describe('Service : Project Keys', function() {

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
    ProjectKeys= $injector.get('ProjectKeys');
    ProjectsFixtures = $injector.get('ProjectsFixtures');
    ProjectKeysFixtures = $injector.get('ProjectKeysFixtures');

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
  describe('When project does not have any keys', function(){

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

    describe('when a new key is created', function(){
      beforeEach(function(){
        key = ProjectKeysFixtures.get('newKey');
        cStub = ProjectKeysFixtures.getStub('createNewKey');
        HttpBackendBuilder.build(cStub.request, cStub.response);
      });

      it('will add the value to the rootScope', function(){
        ProjectKeys.create($rootScope.currentProject.id, key)
          .then(function(){
            expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
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

    describe('when a new key is created', function(){
      beforeEach(function(){
        key = ProjectKeysFixtures.get('newKeyForProjectWithOneKeyOneEnvironment');
        cStub = ProjectKeysFixtures.getStub('createNewKeyForProjectWithOneKeyOneEnvironment');
        HttpBackendBuilder.build(cStub.request, cStub.response);
      });

      it('will add the value to the rootScope', function(){
        ProjectKeys.create($rootScope.currentProject.id, key)
          .then(function(){
            expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
          });
      });
      xit('will add the values to environments', function(){
        // TODO
        // ProjectKeys.create($rootScope.currentProject.id, key)
        //   .then(function(){
        //     expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
        //     expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
        //   });
      });
    });

    describe('when a key name is updated', function(){
      beforeEach(function(){
        key = ProjectKeysFixtures.get('key1');
        cStub = ProjectKeysFixtures.getStub('updateKey1Name');
        HttpBackendBuilder.build(cStub.request, cStub.response);
      });

      it('will add the value to the rootScope', function(){
        data = {'name': key.name + 'updated'};
        ProjectKeys.update($rootScope.currentProject.id, key.id, data)
          .then(function(){
            // updated name in the
            expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
            expect($rootScope.currentProject.keys[key.id].name)
              .toBe(key.name + 'updated');
          });
      });
      xit('will add the values to environments', function(){
        // TODO
        // ProjectKeys.create($rootScope.currentProject.id, key)
        //   .then(function(){
        //     expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
        //     expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
        //   });
      });
    });

    describe('when a key name is deleted', function(){
      beforeEach(function(){
        key = ProjectKeysFixtures.get('key1');
        cStub = ProjectKeysFixtures.getStub('updateKey1Name');
        HttpBackendBuilder.build(cStub.request, cStub.response);
      });

      it('will add the value to the rootScope', function(){
        ProjectKeys.update($rootScope.currentProject.id, key.id)
          .then(function(){
            expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
            expect($rootScope.currentProject.keys[key.id]).toBeUndefined();
          });
      });
      xit('will add the values to environments', function(){
        // TODO
        // ProjectKeys.create($rootScope.currentProject.id, key)
        //   .then(function(){
        //     expect($rootScope.currentProject.keys).toEqual(jasmine.any(Object));
        //     expect($rootScope.currentProject.keys[key.id]).not.toBeUndefined();
        //   });
      });
    });

  });

});
