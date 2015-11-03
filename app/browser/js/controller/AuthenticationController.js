angular.module('app').controller('AuthenticationCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$q',
  'lodash',
  'Auth',
  'Projects',
  'Users',
  'Analytics',
  function ($scope, $rootScope, $state, $q, _, Auth, Projects, Users, Analytics){

  function init(){
    $scope.credentials = {};
    $scope.SIGNUP = 'signup';
    $scope.LOGIN = 'signin';
    $scope.authType  = $scope.SIGNUP;
    $scope.showLoginError = false;
    $scope.emailError = false;
    $scope.nameError = false;
    $scope.passwordError = false;
    $scope.forgotPassword = Auth.forgotPasswordNotify();
    if($scope.forgotPassword){
      $scope.authType = $scope.LOGIN;
    }
  }

  function validEmail(){
    if(_.isEmpty($scope.credentials.email)){
      $scope.emailErrorMessage = "The email field is required.";
      $scope.emailError = true;
      return false;
    }
    // Email validation RegEx that allosw Unicodes.
    // Reference - https://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!re.test($scope.credentials.email)){
      $scope.emailErrorMessage = "The email field is invalid.";
      $scope.emailError = true;
      return false;
    }
    return true;
  }

  function validName(){
    if(_.isEmpty($scope.credentials.name)){
      $scope.nameErrorMessage = "The name field is required.";
      $scope.nameError = true;
      return false;
    }
    return true;
  }

  function validPassword(){
    if(_.isEmpty($scope.credentials.password)){
      $scope.passwordErrorMessage = "The password field is required.";
      $scope.passwordError = true;
      return false;
    }
    return true;
  }

  $scope.login = function(){
    $scope.showLoginError = false;
    $scope.emailError = false;
    $scope.nameError = false;
    $scope.passwordError = false;
    $scope.genericLoginErrorMessage = false;

    if(!validEmail() || !validPassword()) return $q.reject();

    return Auth.login($scope.credentials)
      .then(function(loggedIn){
        if(loggedIn){

          // Analytics identify USER
          Users.getCurrentUserInformation().then(function(user){
            Analytics.setUserID(user.id);
          });

          $state.go('projectcreateoropen');
        }
        else{
          $scope.genericLoginErrorMessage =
            "Incorrect Credentials. Please try again.";
        }
    });
  };

  $scope.signup = function(){
    $scope.emailError = false;
    $scope.emailErrorMessage = '';
    $scope.nameError = false;
    $scope.nameErrorMessage = '';
    $scope.passwordError = false;
    $scope.passwordErrorMessage = '';
    $scope.genericSignupErrorMessage = false;
    var allowSignup = true;

    if(!validName() || !validEmail() || !validPassword()) return $q.reject();

    return Users.create($scope.credentials)
      .then(function(data){
        if(data.id !== undefined){
          var userData = {};
          userData.email = data.email;
          userData.password = $scope.credentials.password;
          return Auth.login(userData)
            .then(function(loggedIn){
              if(loggedIn){
                // Analytics identify USER
                Users.getCurrentUserInformation().then(function(user){
                  Analytics.setUserID(user.id);
                });
                $state.go('projectcreateoropen');
              } else {
                $scope.genericSignupErrorMessage =
                  'Something went wrong. Please check your internet connection and try again';
              }
          });
        } else {
          if(typeof data.data.email != 'undefined'){
            $scope.emailErrorMessage = data.data.email[0];
            $scope.emailError = true;
          }
          if(typeof data.data.name != 'undefined'){
            $scope.nameErrorMessage = data.data.name[0];
            $scope.nameError = true;
          }
          if(typeof data.data.password != 'undefined'){
            $scope.passwordErrorMessage = data.data.password[0];
            $scope.passwordError = true;
          }
          return;
        }
      });
  };

  $scope.submit = function() {
    Auth.setForgotPassword(false);
    $scope.loading = true;
    if ($scope.SIGNUP == $scope.authType){
      return $scope.signup().then(function(){
      }).finally(function(){
        $scope.loading = false;
      });
    }else{
      return $scope.login().then(function(){
      }).finally(function(){
        $scope.loading = false;
      });
    }
  };

  $scope.toggleAuthenticationType = function(){
    $scope.authType =
      ( $scope.authType === $scope.LOGIN ? $scope.SIGNUP : $scope.LOGIN );
  };

  init();
}]);
