// 'use strict';

describe('Service : Project Key Values', function() {

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
    ProjectsFixtures = $injector.get('ProjectsFixtures');

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
  describe('When user has a project already', function(){
    beforeEach(function(){
      ProjectsFixtures.get('projectWithTwoCollectionNoItems');
      pStub = ProjectsFixtures.getStub('retrieveProjectWithTwoCollectionNoItems');
      HttpBackendBuilder.build(pStub.request, pStub.response);

      Projects.loadProjectToRootScope(p.id);

      $httpBackend.flush();
    });

    it('First Environment Test', function(){
      expect(true).toBe(true);
    });
  });


});
