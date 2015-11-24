describe('Controller: Mocking Response Controller', function() {
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

  describe('Able to initilise form mocking responses', function($injector){
    beforeEach(function(){


    });

    afterEach(function(){
      $scope.$digest();
      $rootScope.$apply();
    });

    describe('Able to view and Mocking Responses ', function(){
      it('is able to load Responses Form', function(){
        $controller('MockingResponseCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
        expect($scope.statusCode).toBe(false);
      });

      it('is able to load Responses', function(){
        $scope.agMockingResponse = {};
        $controller('MockingResponseCtrl', {
          $scope: $scope,
          $rootScope: $rootScope,
        });
        expect($scope.statusCode).toBe(true);
      });


    });
  });
});
