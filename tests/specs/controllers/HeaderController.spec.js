describe('Controller: HeaderController', function() {

  var $rootScope, $scope, $controller, $q;

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
    Auth = $injector.get('Auth');

    // Creating controller
    $controller('HeaderCtrl', {
      $scope: $scope,
      $rootScope: $rootScope
    });

      // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function(){
    $scope.$digest();
    $rootScope.$apply();
  });

  describe('able to set status', function(){
    it('Application is online', function(){
      $scope.setConnectionStatus(true);
      expect($scope.online).toEqual(true);
      expect($scope.connectionStatus).toBe("");
    });

    it('Application is offline', function(){
      $scope.setConnectionStatus(false);
      expect($scope.online).toEqual(false);
      expect($scope.connectionStatus).toBe("Offline");
    });
  });

  describe('Logout', function(){
    describe('When user tries to logout', function(){
      it('localStorage is cleared()', function(){
        var token = 'TOKEN-TOKEN-TOKEN';

        Auth.set(token);
        var accessToken = Auth.get();
        expect(accessToken).toBe(token);

        $scope.logout();

        accessToken = Auth.get();
        expect(accessToken).toBe(null);
      });
    });
  });

});
