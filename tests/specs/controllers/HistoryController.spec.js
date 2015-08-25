describe('Controller: HistoryController', function() {
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
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  describe('Able to initilise editor history', function(){
    beforeEach(function(){
      $controller('HistoryCtrl', {
        $scope: $scope,
        $rootScope: $rootScope,
      });
    });

    afterEach(function(){
      $scope.$digest();
      $rootScope.$apply();
    });

    it('has no null values', function(){
      expect($scope.recentRequest).not.toBeNull();
      expect($scope.historyTimeStamps).not.toBeNull();
      expect($scope.lastRequest).not.toBeNull();
    });

    describe('Able to update and broadcast history items', function(){
      beforeEach(function(){
    });

      xit('is able to perform null request', function(){
        var currentTime = new Date();
        $scope.performRequest(currentTime.getTime());
      });

      it('is able to receive update history broadcast', function(){
        $rootScope.$broadcast('updateHistory');
        expect($scope.recentRequest).not.toBeNull();
        expect($scope.historyTimeStamps).not.toBeNull();
        expect($scope.lastRequest).not.toBeNull();
      });

    });
  });
});
