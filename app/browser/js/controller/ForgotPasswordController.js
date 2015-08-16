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
    $scope.SIGNUP = 'signup';
    $scope.LOGIN = 'signin';
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
    // Email validation RegEx that allosw Unicodes.
    // Reference - https://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!re.test($scope.forgotPassword.email)){
      $scope.emailErrorMessage = "The email field is invalid.";
      $scope.emailError = true;
      return false;
    }
    return true;
  }

  function validName(){
    if(_.isEmpty($scope.forgotPassword.name)){
      $scope.nameErrorMessage = "The name field is required.";
      $scope.nameError = true;
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
      console.log("Less character length");
      $scope.passwordErrorMessage = "The password mininum 8 characters.";
      $scope.passwordError = true;
      return false;
    }

    if($scope.forgotPassword.newPassword !== $scope.forgotPassword.newPasswordMatch){
      console.log("password didn't match");
      $scope.passwordErrorMessage = "The password field didnt match.";
      $scope.passwordError = true;
      return false;
    }

    return true;
  }

  function validCode(){
    if(_.isEmpty($scope.forgotPassword.code)){
      $scope.codeErrorMessage = "The code field is required.";
      $scope.codeError = true;
      return false;
    }
    return true;
  }

  $scope.getCode = function(){
    console.log("Get Code");
    if (validEmail()){
      $scope.loading = true;
      $timeout(function(){
        console.log("email : " +
          $scope.forgotPassword.email);
      
        //   how to send call get cade
        // ForgotPassword.sendCodeRequestTest()
        //   .then(function(data){
        //     console.log("data" + data);
        //   }
        // );

        $scope.loading = false;
        $scope.showGetCode = false;
        $scope.showInputCode = true;

      }, 2000);



    }
  };

  $scope.submitCode = function(){
    console.log("Submit Code");
    $scope.codeError = false;

    if (validCode()){
      $scope.loading = true; // start loading
      $timeout(function() {
        console.log("email : " +
          $scope.forgotPassword.email);
        console.log("code : " +
          $scope.forgotPassword.code);
        //   how to send call get cade
        // if password reset is success load app
        $scope.loading = false; // stop loading
        // $state.go('app');
        // else
        $scope.showGetCode = false;
        $scope.showInputCode = false;
        $scope.showNewPassword = true;
      }, 2000);
    }
  };

  $scope.submitNewPassword = function(){
    console.log("Submit New Password");
    $scope.passwordError = false;

    if (validPassword()){
      $scope.loading = true; // start loading
      $timeout(function() {
        console.log("email : " +
          $scope.forgotPassword.email);
        console.log("code : " +
          $scope.forgotPassword.code);
        console.log("newPassword : " +
          $scope.forgotPassword.newPassword);
        //   how to send call get cade
        // if password reset is success load app
        $scope.loading = false; // stop loading
        $state.go('app');
        // else
        //$scope.showGetCode = false;
        //$scope.showInputCode = false;
        //$scope.showNewPassword = true;
      }, 2000);
    }
  };


}]);
