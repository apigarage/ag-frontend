angular.module('app').controller('ForgotPasswordCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$timeout',
  'lodash',
  'Auth',
  'Projects',
  'Users',
  'ForgotPassword',
  function ($scope, $rootScope, $state, $timeout,  _, Auth, Projects, Users, ForgotPassword){

  init();

  function init(){
    $scope.forgotPassword = {};
    $scope.RESET = 'reset';
    $scope.authType  = $scope.RESET;
    $scope.showGetCode = true;
    $scope.showInputCode = false;
    $scope.showNewPassword = false;
    $scope.showLoginError = false;
    $scope.emailError = false;
    $scope.nameError = false;
    $scope.passwordError = false;
  }

  function validEmail(){
    if(_.isEmpty($scope.forgotPassword.email)){
      $scope.emailErrorMessage = "The email field is required.";
      $scope.emailError = true;
      return false;
    }
    // Email validation RegEx that allows Unicodes.
    // Reference - https://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!re.test($scope.forgotPassword.email)){
      $scope.emailErrorMessage = "The email field is invalid.";
      $scope.emailError = true;
      return false;
    }
    return true;
  }

  function validPassword(){
    $scope.passwordError = false;
    if(_.isEmpty($scope.forgotPassword.newPassword) ||
      _.isEmpty($scope.forgotPassword.newPasswordMatch) ){
      $scope.passwordErrorMessage = "The password fields is required.";
      $scope.passwordError = true;
      return false;
    }

    if($scope.forgotPassword.newPassword.length <= 7 ||
      $scope.forgotPassword.newPasswordMatch.length <= 7){
      $scope.passwordErrorMessage = "The password mininum 8 characters.";
      $scope.passwordError = true;
      return false;
    }

    if($scope.forgotPassword.newPassword !== $scope.forgotPassword.newPasswordMatch){
      $scope.passwordErrorMessage = "The password field didnt match.";
      $scope.passwordError = true;
      return false;
    }

    $scope.forgotPassword.password = $scope.forgotPassword.newPassword;
    return true;
  }

  function validCode(){
    if(_.isEmpty($scope.forgotPassword.token)){
      $scope.codeErrorMessage = "The code field is required.";
      $scope.codeError = true;
      return false;
    }
    return true;
  }

  function isServiceAvailable(responseStatus){
    return (responseStatus === undefined ||
      responseStatus >= 404 ||
      responseStatus === 0 ||
      responseStatus >= 500);
  }

  $scope.getCode = function(){
    $scope.emailError = false;
    if (validEmail()){
      $scope.loading = true;
      return ForgotPassword.sendCodeRequest($scope.forgotPassword)
        .then(function(response){
          if (isServiceAvailable(response.status)){
            $scope.emailErrorMessage = "Unable to reach reset password service";
            $scope.emailError = true;
            $scope.loading = false;
          }else if (response.status == 401){
            // Email does not exist in the system.
            $scope.emailErrorMessage = response.data.email[0];
            $scope.emailError = true;
            $scope.loading = false;
          }else{
            $scope.showGetCode = false;
            $scope.showInputCode = true;
            $scope.loading = false;
          }
        }
      );
    }
  };

  $scope.submitCode = function(){
    $scope.codeError = false;
    if (validCode()){
      $scope.loading = true; // start loading
      return ForgotPassword.verifyCodeRequest($scope.forgotPassword)
        .then(function(response){
          if(isServiceAvailable(response.status)){
            $scope.codeErrorMessage = "Unable to reach reset password service";
            $scope.codeError = true;
            $scope.loading = false;
          } else if (response.status == 401){
            // Invalid Verification Code
            $scope.codeErrorMessage = response.data.token[0];
            $scope.codeError = true;
            $scope.loading = false;
          }else{
            $scope.showInputCode = false;
            $scope.showNewPassword = true;
            $scope.loading = false;
          }
        }
      );
    }
  };

  $scope.submitNewPassword = function(){
    $scope.passwordError = false;
    if (validPassword()){
      $scope.loading = true;
      return ForgotPassword.resetPassword($scope.forgotPassword)
        .then(function(response){
          if(isServiceAvailable(response.status)){
            $scope.passwordErrorMessage = "Unable to reach reset password service";
            $scope.passwordError = true;
            $scope.loading = false;
          } else if  (response.status == 401){
            // Invalid Verification Code
            $scope.passwordErrorMessage = response.data.token[0];
            $scope.passwordError = true;
            $scope.loading = false;
          } else {
            $scope.loading = false;
            ForgotPassword.setForgotPassword(true);
            $state.go('authentication');
          }
        }
      );
    }
  };
}]);
