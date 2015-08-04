// 'use strict';

describe('Controller: Auth', function() {

  var $rootScope, $scope, $controller, $q;

  beforeEach(module('app'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = _$q_;

    $controller('AuthCtrl', {
      $scope: $scope,
      $rootScope: $rootScope,
      $modalInstance: {},
      authType: 'signup' // should not make a difference it is being used just for views
       });
  }));

  afterEach(function() {
    $rootScope.$apply();
  });
  describe('Sign Up', function () {

    // // email is empty
    // describe('If Empty Email String is Provided', function(){
    //   it("Email Error should be true", function(){
    //     $scope.signup();
    //     expect($scope.emailError).toEqual(true);
    //     // reseting variables
    //     $scope.emailError = false;
    //     $scope.credentials.email = '';
    //     $scope.signup();
    //     expect($scope.emailError).toEqual(true);
    //   });
    //
    //   it("Email Error message should be 'The email field is invalid'", function(){
    //     $scope.signup();
    //     expect($scope.emailErrorMessage).toEqual('The email field is invalid');
    //     // reseting variables
    //     $scope.emailErrorMessage = '' ;
    //     $scope.credentials.email = '';
    //     $scope.signup();
    //     expect($scope.emailErrorMessage).toEqual('The email field is invalid');
    //   });
    // });
    //
    // // name is empty
    // describe('If Empty Name String is Provided', function(){
    //
    //   it("Name Error should be true", function(){
    //     $scope.credentials.name = '';
    //     $scope.signup();
    //     expect($scope.NameError).toEqual(true);
    //   });
    //
    //   it("Name Error message should be 'The email field is invalid'", function(){
    //     $scope.credentials.name = '';
    //     $scope.signup();
    //     expect($scope.nameErrorMessage).toEqual('The name field is required.');
    //   });
    // });
    //
    // // password is empty
    // describe('If Empty Password String is Provided', function(){
    //
    //   it("Password Error should be true", function(){
    //     // password is not defined
    //     $scope.signup();
    //     expect($scope.passwordError).toEqual(true);
    //     //reseting variable
    //     $scope.passwordError = false;
    //     $scope.credentials.password = '';
    //     $scope.signup();
    //     expect($scope.passwordError).toEqual(true);
    //   });
    //
    //   it("Password Error message should be 'The password field is invalid'", function(){
    //     // password is undefined
    //     $scope.signup();
    //     expect($scope.passordErrorMessage).toEqual('The password field is required');
    //     // reseting error message
    //     $scope.passordErrorMessage = '' ;
    //     $scope.credentials.password = '';
    //     $scope.signup();
    //     expect($scope.passordErrorMessage).toEqual('The password field is required');
    //   });
    // });

    // information is all provided
    //  password is empty
    describe('All Information is provided', function(){
      var $httpBackend ;
      beforeEach(inject(function(_$httpBackend_) {
        // Set up the mock http service responses
        $httpBackend = _$httpBackend_;
        // backend definition common for all tests
        $httpBackend.expectPOST('dev.chinman.backend.com/api/users',{name: "test",
                                  email: "test@test.ca",
                                  password: "test123"})
                        .respond(200, {"name":"test",
                          "email":"test@test.ca",
                          "id":18});
      }));

      afterEach(function() {
        $rootScope.$apply();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it("Email is invalid", function(){
        // password is not defined
        $scope.credentials.email = 'test@test.ca';
        $scope.credentials.name = 'test';
        $scope.credentials.password = 'test123';
        $scope.signup();
        $scope.$digest();
        $httpBackend.flush();
        console.log($scope.userData);
        $rootScope.$apply();
        expect($scope.emailError).toEqual(false);
        expect($scope.emailErrorMessage).toEqual(false);
      });

    });
  });
});
