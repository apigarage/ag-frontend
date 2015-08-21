// 'use strict';

describe('Services : Projects', function() {

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
    ItemsFixtures = $injector.get('ItemsFixtures');
    CollectionsFixtures = $injector.get('CollectionsFixtures');
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

  // PROJECT CRUD TESTING
  describe('When user gets all projects', function(){
    describe('if projects exists', function(){
      xit('receives all projects');
    });
    describe('if no project exist', function(){
      xit('receives empty array');
    });
  });
  describe('When users gets a project', function(){
    describe('if project exists', function(){
      xit('receives the project');
    });
    describe('if project does not exist', function(){
      xit('receives 404');
    });
  });
  describe('When user updates a project', function(){
    describe('if project exists', function(){
      describe('if the change was done', function(){
        xit('receives the updated project');
      });
      describe('if the change was node done', function(){
        xit('receives the bad data request');
      });
    });
    describe('if project does not exist', function(){
      xit('receives 404');
    });
  });
  describe('When user creates a project', function(){
    describe('if the project was created', function(){
      xit('receives the newly created project'); // with name description id.
    });
    describe('if the change was node done', function(){
      xit('receives the bad data request');
    });
  });
  describe('When user deletes a project', function(){
    describe('if project exists', function(){
      describe('if the project was deleted', function(){
        xit('receives the content was removed');
      });
      describe('if the project was not deleted', function(){
        xit('receives the bad data request');
      });
    });
    describe('if project does not exist', function(){
      xit('receives 404');
    });
  });

  // // PROJECT MANAGEMENT
  // describe('When user has a project already', function(){
  //   describe('', function(){
  //
  //   });
  // });


});
