// 'use strict';

describe('Controller: Authentication', function() {

  var $rootScope, $scope, $controller, $q;

  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function($injector){
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $q = $injector.get('$q');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');

    Config = $injector.get('Config');

    $scope = $rootScope.$new();
    $controller('AuthenticationCtrl', {
      $scope: $scope,
      $rootScope: $rootScope,
    });

    // This allows all the html requests for templates to go to server.
    // Also, passThrough() is not working, so we are using response()
    // and returning nothing. It should not affect our testing as we
    // are only testing controllers (and not html).
    $httpBackend.when('GET',/.*html.*/).respond(200, '');
  }));

  afterEach(function() {
    $rootScope.$apply();
  });

  it('authType is set to SignUp Screen on startup', function(){
    expect($scope.authType).toBe($scope.SIGNUP);
  });

  describe('ToggleAuthenticationType', function(){

    it('authType is set to LOGIN, when it is set to SIGNUP', function(){
      $scope.authType = $scope.SIGNUP;
      $scope.toggleAuthenticationType();
      expect($scope.authType).toBe($scope.LOGIN);
    });

    it('authType is set to SIGNUP, when it is set to LOGIN', function(){
      $scope.authType = $scope.LOGIN;
      $scope.toggleAuthenticationType();
      expect($scope.authType).toBe($scope.SIGNUP);
    });

  });

  describe('Sign In', function(){

    describe('If Empty Email String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.password = 'somepassword';
        $scope.credentials.email = '';
        $scope.login();
      });

      it("Email Error should be true", function(){
        expect($scope.emailError).toEqual(true);
      });

      it("Email Error message should be 'The email field is required'", function(){
        expect($scope.emailErrorMessage).toEqual('The email field is required.');
      });
    });

    describe('If Empty Password String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.email = 'some@email.com';
        $scope.credentials.password = '';
        $scope.login();
      });

      it("Password Error should be true", function(){
        expect($scope.passwordError).toEqual(true);
      });

      it("Password Error message should be 'The password field is required'", function(){
        expect($scope.passwordErrorMessage).toEqual('The password field is required.');
      });
    });
  });

  describe('Sign Up', function(){

    describe('If Empty Name String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.email = 'some@email.com';
        $scope.credentials.password = 'somepassword';
        $scope.credentials.name = '';
        $scope.signup();
      });

      it("Name Error should be true", function(){
        expect($scope.nameError).toEqual(true);
      });

      it("Name Error message should be 'The name field is required'", function(){
        expect($scope.nameErrorMessage).toEqual('The name field is required.');
      });
    });

    describe('If Empty Email String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.password = 'somepassword';
        $scope.credentials.name = 'Hello Name';
        $scope.credentials.email = '';
        $scope.login();
      });

      it("Email Error should be true", function(){
        expect($scope.emailError).toEqual(true);
      });

      it("Email Error message should be 'The email field is required'", function(){
        expect($scope.emailErrorMessage).toEqual('The email field is required.');
      });
    });

    describe('If Empty Password String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.name = 'Hello Name';
        $scope.credentials.email = 'some@email.com';
        $scope.credentials.password = '';
        $scope.login();
      });

      it("Password Error should be true", function(){
        expect($scope.passwordError).toEqual(true);
      });

      it("Password Error message should be 'The password field is required'", function(){
        expect($scope.passwordErrorMessage).toEqual('The password field is required.');
      });
    });

    // TO BE DONE
    // describe('All Information is provided', function(){
    //   var $httpBackend ;
    //   beforeEach(inject(function(_$httpBackend_) {
    //     // Set up the mock http service responses
    //     $httpBackend = _$httpBackend_;
    //     // backend definition common for all tests
    //
    //     $httpBackend.expectPOST('' + Config.url + 'api/users',
    //                             {name: "test",
    //                               email: "test@test.ca",
    //                               password: "test123"})
    //                     .respond(200, {"name":"test",
    //                       "email":"test@test.ca",
    //                       "id":18});
    //   }));
    //
    //   afterEach(function() {
    //     $rootScope.$apply();
    //     $httpBackend.verifyNoOutstandingExpectation();
    //     $httpBackend.verifyNoOutstandingRequest();
    //   });
    //
    //   it("Email is required", function(){
    //     // password is not defined
    //     $scope.credentials.email = 'test@test.ca';
    //     $scope.credentials.name = 'test';
    //     $scope.credentials.password = 'test123';
    //     $scope.signup();
    //     $scope.$digest();
    //     $httpBackend.flush();
    //     console.log($scope.userData);
    //     $rootScope.$apply();
    //     expect($scope.emailError).toEqual(false);
    //     expect($scope.emailErrorMessage).toEqual(false);
    //   });
  });
});
