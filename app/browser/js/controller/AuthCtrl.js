'use strict';

/* Controllers */

angular.module('app')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$modalInstance', 'Auth', 'Projects', 'Users', 'authType', function($scope, $rootScope, $modalInstance, Auth, Projects, Users, authType){

    init();

    function init(){
      $scope.credentials = {};
      $scope.authType  = authType;
      $scope.showLoginError = false;

      $scope.emailError = false;
      $scope.NameError = false;
      $scope.passwordError = false;
    }

    $scope.signin = function(){
      $scope.showLoginError = false;
      Auth.login($scope.credentials)
        .then(function(loggedIn){
          if(loggedIn){
            $modalInstance.close(true);
            return Projects.updateAll();
          }
          else{
            $scope.showLoginError = true;
          }
        });
    };

    $scope.signup = function(){
      $scope.emailError = false;
      $scope.NameError = false;
      $scope.passwordError = false;
      var allowSignup = true;

      if(typeof $scope.credentials.email == 'undefined' || $scope.credentials.email.trim().length == 0 ){
        $scope.emailErrorMessage = "The email field is invalid";
        $scope.emailError = true;
        allowSignup = false;
      }
      if(typeof $scope.credentials.name == 'undefined' || $scope.credentials.name.trim().length == 0 ){
        $scope.nameErrorMessage = "The name field is required.";
         $scope.NameError = true;
        allowSignup = false;
      }
      if(typeof $scope.credentials.password == 'undefined' || $scope.credentials.password.trim().length == 0 ){
        $scope.passordErrorMessage = "The password field is required";
        $scope.passwordError = true;
        allowSignup = false;
      }
      if(allowSignup){
        return Users.create($scope.credentials)
          .then(function(data){
            $scope.userData = data;
            if(data.id != undefined){
              var userData = {};
              userData.email = data.email;
              userData.password = $scope.credentials.password;
              Auth.login(userData)
              .then(function(loggedIn){
                if(loggedIn){
                  $modalInstance.close(true);
                  return Projects.updateAll();
                } else {
                  $scope.showSignupError = true;
                }
              });
            } else {
              if(typeof data.data.email != 'undefined'){
                $scope.emailErrorMessage = data.data.email[0];
                $scope.emailError = true;
              }
              if(typeof data.data.name != 'undefined'){
                $scope.nameErrorMessage = data.data.name[0];
                $scope.NameError = true;          }
                if(typeof data.data.password != 'undefined'){
                  $scope.passordErrorMessage = data.data.password[0];
                  $scope.passwordError = true;
                }
              }
      });
      }
    };


  }])
