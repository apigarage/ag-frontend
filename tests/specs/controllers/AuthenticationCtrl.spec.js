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
    HttpBackendBuilder = $injector.get('HttpBackendBuilder');
    Config = $injector.get('Config');
    UsersFixtures = $injector.get('UsersFixtures');
    UsersFixtures.spyOnCurrentUser();

    AuthFixtures = $injector.get('AuthFixtures');

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
    localStorage.clear();
  }));

  afterEach(function(){
    $rootScope.$apply();
    $scope.$digest();
  });

  // Creating a new instance of controller to test the forgot password
  // flag during the initial load.
  describe('When forgotPassword is set, ', function(){
    beforeEach(function(){
      $scope = $rootScope.$new();
      $rootScope.forgotPassword = true;
      $controller('AuthenticationCtrl', {
        $scope: $scope,
        $rootScope: $rootScope,
      });
    });
    it('will set the the authType to Login', function(){
      expect($scope.authType).toBe($scope.LOGIN);
    });
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
  describe('Submit', function(){
    beforeEach(function(){
      spyOn($scope, 'signup').and.returnValue($q.resolve(true));
      spyOn($scope, 'login').and.returnValue($q.resolve(true));
    });

    describe('When authType is Signup', function(){
      beforeEach(function(){
        $scope.authType = $scope.SIGNUP;
      });

      it('will make the signup call', function(){
        $scope.submit().then(function(){ // the data is returned from the spy.
          expect($scope.loading).toBe(false);
        });
      });
    });

    describe('When authType is Login', function(){
      beforeEach(function(){
        $scope.authType = $scope.LOGIN;
      });

      it('will make the login call', function(){
        $scope.submit().then(function(){ // the data is returned from the spy.
          expect($scope.loading).toBe(false);
        });
      });
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

    describe('If Invalid Email String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.password = 'somepassword';
        $scope.credentials.name = 'Hello Name';
        $scope.credentials.email = 'invalidEMail';
        $scope.login();
      });

      it("Email Error should be true", function(){
        expect($scope.emailError).toEqual(true);
      });

      it("Email Error message should be 'The email field is invalid.'", function(){
        expect($scope.emailErrorMessage).toEqual('The email field is invalid.');
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

    describe('All information is provided', function(){
      afterEach(function(){
        $httpBackend.flush();
      });

      describe('But incorrect credentials (server side)', function(){
        it("will show login error message", function(){
          var user = UsersFixtures.get('userJohnIncorrect');
          $scope.credentials.email = user.email;
          $scope.credentials.password = user.password;

          // Stubbing Login
          var loginStub = AuthFixtures.getStub('loginThatDoesNotWork');
          HttpBackendBuilder.build(loginStub.request, loginStub.response);

          $scope.login().then(function(){
            // TODO - Verify the $state of the app
            expect($scope.genericLoginErrorMessage).toEqual("Incorrect Credentials. Please try again.");
          });
        });
      });

      describe('Correct credentials (server side)', function(){
        it("will show no error message", function(){
          var user = UsersFixtures.get('userJohn');
          $scope.credentials.email = user.email;
          $scope.credentials.password = user.password;

          // Stubbing Login
          var loginStub = AuthFixtures.getStub('loginUserJohn');
          HttpBackendBuilder.build(loginStub.request, loginStub.response);

          $scope.login().then(function(){
            // TODO - Verify the $state of the app
            expect($scope.genericLoginErrorMessage).toEqual(false);
          });
        });
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

    describe('If Invalid Email String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.password = 'somepassword';
        $scope.credentials.name = 'Hello Name';
        $scope.credentials.email = 'invalidEMail';
        $scope.signup();
      });

      it("Email Error should be true", function(){
        expect($scope.emailError).toEqual(true);
      });

      it("Email Error message should be 'The email field is invalid.'", function(){
        expect($scope.emailErrorMessage).toEqual('The email field is invalid.');
      });
    });

    describe('If Empty Email String is Provided', function(){
      beforeEach(function(){
        $scope.credentials.password = 'somepassword';
        $scope.credentials.name = 'Hello Name';
        $scope.credentials.email = '';
        $scope.signup();
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
        $scope.signup();
      });

      it("Password Error should be true", function(){
        expect($scope.passwordError).toEqual(true);
      });

      it("Password Error message should be 'The password field is required'", function(){
        expect($scope.passwordErrorMessage).toEqual('The password field is required.');
      });
    });

    describe('All information is provided', function(){
      afterEach(function(){
        $httpBackend.flush();
      });

      describe('All the information is valid.', function(){
        it("will show no error message", function(){
          var user = UsersFixtures.get('userJohn');
          $scope.credentials.email = user.email;
          $scope.credentials.password = user.password;
          $scope.credentials.name = user.name;

          // Stubbing Sign Up
          var userStub = UsersFixtures.getStub('createUserJohnThatWorks');
          HttpBackendBuilder.build(userStub.request, userStub.response);

          // Stubbing Login
          var loginStub = AuthFixtures.getStub('loginUserJohn');
          HttpBackendBuilder.build(loginStub.request, loginStub.response);

          $scope.signup().then(function(){
            // TODO - Verify the $state of the app
            expect($scope.nameError).toEqual(false);
            expect($scope.emailError).toEqual(false);
            expect($scope.passwordError).toEqual(false);
            expect($scope.genericSignupErrorMessage).toEqual(false);
          });
        });

      });

      describe('If email is already taken', function(){
        it('will show the email error message', function(){
          var user = UsersFixtures.get('userWithExistingEmail');
          $scope.credentials.email = user.email;
          $scope.credentials.password = user.password;
          $scope.credentials.name = user.name;

          // Stubbing Sign Up
          var userStub = UsersFixtures.getStub('createUserWithExistingEmail');
          HttpBackendBuilder.build(userStub.request, userStub.response);

          $scope.signup().then(function(){
            // TODO - Verify the $state of the app
            expect($scope.emailError).toEqual(true);
          });

        });
      });

    });
  });
});
