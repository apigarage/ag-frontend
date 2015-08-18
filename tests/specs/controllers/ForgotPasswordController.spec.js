describe('Controller: ForgotPasswordCtrl', function() {

  var $rootScope, $scope, $controller, $q;

  beforeEach(function(){
    module('app');
    module('ngMockE2E'); //<-- IMPORTANT! Without this line of code,
      // it will not load templates, and will break the test infrastructure.
  });

  beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _HttpBackendBuilder_, _Config_, _ForgotPasswordStubs_, _RequestUtility_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    HttpBackendBuilder = _HttpBackendBuilder_;
    Config = _Config_;
    ForgotPasswordStubs = _ForgotPasswordStubs_;
    RequestUtility = _RequestUtility_;

    $controller('ForgotPasswordCtrl', {
      $scope: $scope,
      $rootScope: $rootScope,
      $modalInstance: {}
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

  describe('Able to reset forgot password', function(){
    afterEach(function(){
      $httpBackend.flush();
    });
    it('get email code', function(){
      stub = ForgotPasswordStubs.sendEmailCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.getCode().then(function(){
        expect($scope.showGetCode).toBe(false);
        expect($scope.showInputCode).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('get email code unreachable', function(){
      stub = ForgotPasswordStubs.sendEmailUnreachableCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.getCode().then(function(){
        expect($scope.emailErrorMessage).toEqual("Unable to reach reset password service");
        expect($scope.emailError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('get email does not exist in the system', function(){
      stub = ForgotPasswordStubs.sendEmailExistsCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.getCode().then(function(){
        expect($scope.emailErrorMessage).toEqual("Email does not exist in the system.");
        expect($scope.emailError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('send valid code', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordEmailCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.submitCode().then(function(){
        expect($scope.showInputCode).toBe(false);
        expect($scope.showNewPassword).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('set valid code unreachable', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordInvalidCodeUnreachableStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.submitCode().then(function(){
        expect($scope.codeErrorMessage).toEqual("Unable to reach reset password service");
        expect($scope.codeError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('set invalid verification code to system', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordUsedCodeUnreachableStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.submitCode().then(function(){
        expect($scope.codeErrorMessage).toEqual("Invalid Verification Code");
        expect($scope.codeError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('set valid password', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword().then(function(){
        expect($scope.loading).toBe(false);
        expect($rootScope.forgotPassword).toBe(true);
      });
    });
    it('set valid password unreachable', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordUnreachableStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword().then(function(){
        expect($scope.passwordErrorMessage).toEqual("Unable to reach reset password service");
        expect($scope.passwordError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
    it('set valid password invalid code', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordInvalidStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword().then(function(){
        expect($scope.passwordErrorMessage).toEqual("Invalid Verification Code");
        expect($scope.passwordError).toBe(true);
        expect($scope.loading).toBe(false);
      });
    });
  });

  describe('Able to verify forgot password input', function(){
    it('if email input empty', function(){
      stub = ForgotPasswordStubs.sendEmailEmptyCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.getCode();
      expect($scope.showGetCode).toBe(true);
      expect($scope.showInputCode).toBe(false);
    });
    it('if email input invalid', function(){
      stub = ForgotPasswordStubs.sendEmailInvalidCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.getCode();
      expect($scope.showGetCode).toBe(true);
      expect($scope.showInputCode).toBe(false);
    });
    it('send invalid code', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordEmailInvalidCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.submitCode();
      expect($scope.codeErrorMessage).toEqual("The code field is required.");
      expect($scope.codeError).toBe(true);
    });
    it('send invalid code', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordEmailInvalidCodeStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.submitCode();
      expect($scope.codeErrorMessage).toEqual("The code field is required.");
      expect($scope.codeError).toBe(true);
    });
    it('set empty password', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordEmptyStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword();
      expect($scope.passwordErrorMessage).toEqual("The password fields is required.");
      expect($scope.passwordError).toBe(true);
    });
    it('set invalid password length', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordInvalidLengthStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword();
      expect($scope.passwordErrorMessage).toEqual("The password mininum 8 characters.");
      expect($scope.passwordError).toBe(true);
    });
    it('set password mismatch', function(){
      stub = ForgotPasswordStubs.sendForgetPasswordMismatchStub;
      HttpBackendBuilder.build(stub.request, stub.response);
      $scope.forgotPassword.email = JSON.parse(stub.request.data).email;
      $scope.forgotPassword.token = JSON.parse(stub.request.data).token;
      $scope.forgotPassword.password = JSON.parse(stub.request.data).password;
      $scope.forgotPassword.newPassword = JSON.parse(stub.request.data).newPassword;
      $scope.forgotPassword.newPasswordMatch = JSON.parse(stub.request.data).newPasswordMatch;
      $scope.submitNewPassword();
      expect($scope.passwordErrorMessage).toEqual("The password field didnt match.");
      expect($scope.passwordError).toBe(true);
    });
  });



});
