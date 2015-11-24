describe('Controller: Mocking Controller', function() {
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
    MockingControllerFixtures = $injector.get('MockingControllerFixtures');


    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  describe('Able to initilise editor mocking responses', function($injector){
    beforeEach(function(){

      $controller('MockingCtrl', {
        $scope: $scope,
        $rootScope: $rootScope,
      });

    });

    afterEach(function(){
      $scope.$digest();
      $rootScope.$apply();
    });

    describe('Able to view and Mocking Responses ', function(){
      beforeEach(function(){

        $controller('MockingCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });

        $scope.agParentEndpoint = {};
        $scope.agParentEndpoint.uuid = 'uuid-1';
        MockingControllerFixturesStubs = MockingControllerFixtures.getStub('responsesList');
        HttpBackendBuilder.build(MockingControllerFixturesStubs.request, MockingControllerFixturesStubs.response);

        MockingControllerFixturesStubs = MockingControllerFixtures.getStub('responsesList');
        HttpBackendBuilder.build(MockingControllerFixturesStubs.request, MockingControllerFixturesStubs.response);
        $httpBackend.flush();

      });
      it('is able to load Responses', function(){
        expect($scope.panels.length).toEqual(1);
      });

      it('is able to search non-matching responses', function(){
        $scope.searchFilter(200);
        expect($scope.panels.length).toEqual(0);
      });

      it('is able to search matching responses', function(){
        $scope.searchFilter(201);
        expect($scope.panels.length).toEqual(1);
      });

    });
  });
});
