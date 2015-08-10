'use strict';

/* Services */

angular.module('app')
  .factory('Auth', [
    '$q',
    '$http',
    '$window',
    '$rootScope',
    'Config',
    function($q, $http, $window, $rootScope, Config){

    var accessToken = null;
    var accessTokenStorageKey = 'accessToken';

    var loadAccessToken = function() {
      return $window.localStorage.getItem(accessTokenStorageKey);
    };

    var setAccessToken = function(token){
      var access_token = $window.localStorage.setItem(accessTokenStorageKey, token);
      return true;
    };

    var logout = function(){
      $window.localStorage.removeItem(accessTokenStorageKey);
    };

    var login = function(credentials){
      var email = credentials.email;
      var password = credentials.password;

      var data = {
        "username": credentials.email,
        "password": credentials.password,
        "client_id": Config.client_id,
        "client_secret": Config.client_secret,
        "grant_type": "password"
      };

      data = $.param(data);

      var options = {
          'method': 'POST',
          'url': Config.url + 'oauth/token' ,
          'headers':{
            "Content-Type": "application/x-www-form-urlencoded"
          },
          'data': data
      };

      return $http(options)
        .then(function(res) {
          return setAccessToken(res.data.access_token);
        })
        .catch(function(res) {
          $window.console.log( res );
          return false;
        });
    };

    return{
      get: loadAccessToken, // get access token.
      set: setAccessToken, // set access token. it also saves it to the browser.
      login: login, // login the user
      logout: logout, // logout the user
    };
  }]);
