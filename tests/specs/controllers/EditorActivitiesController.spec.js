describe('Controller: Activities Controller', function() {
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

    UsersFixtures = $injector.get('UsersFixtures');
    UsersFixtures.spyOnCurrentUser();

    ItemsFixtures = $injector.get('ItemsFixtures');
    $scope.agParentEndpoint = ItemsFixtures.get('item1');

    ActivitiesFixtures = $injector.get('ActivitiesFixtures');

    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  describe('Able to initilise editor activities', function(){
    beforeEach(function(){

      $controller('EditorActivitiesCtrl', {
        $scope: $scope,
        $rootScope: $rootScope,
      });
    });

    afterEach(function(){
      $scope.$digest();
      $rootScope.$apply();
    });

    describe('Able to view and activities ', function(){
      it('is able to load activities', function(){

        createActivitiesStub = ActivitiesFixtures.getStub('activitiesList');
        HttpBackendBuilder.build(createActivitiesStub.request, createActivitiesStub.response);
        $httpBackend.flush();

        expect($scope.activities).toEqual(jasmine.any(Array));

      });

      it('is able to load activities when connection issues occurs', function(){

        createActivitiesStub = ActivitiesFixtures.getStub('activitiesListNoConnection');
        HttpBackendBuilder.build(createActivitiesStub.request, createActivitiesStub.response);
        $httpBackend.flush();

        expect($scope.activities).toEqual(jasmine.any(Array));

      });
    });
  });
});
