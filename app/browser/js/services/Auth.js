'use strict';

/* Services */

angular.module('app')
  .factory('Auth', ['$q', '$http', '$rootScope', 'Config', function($q, $http, $rootScope, Config){

    var accessToken = null;
    var accessTokenStorageKey = 'accessToken';

    /*
     * Loads accessToken from the storage, if any.
     */
    var loadAccessToken = function() {

      // TODO - Remove me when you are done with signin.
      // setAccessToken('yw62FMLaguDph0QrXtjzjucwvfUWEENvXFRmPqLX');
      var deferred = $q.defer();

      // if Google Chrome
      localStorage.getItem(accessTokenStorageKey, function(items){
        accessToken = items[accessTokenStorageKey];
        if( items[accessTokenStorageKey] ){
          $rootScope.isLoggedIn = true;
          deferred.resolve(items[accessTokenStorageKey]);
        } else{
          deferred.reject(false);
        }
      });

      return deferred.promise;
    };

    var setAccessToken = function(token){

      var deferred = $q.defer();
      accessToken = token;

      // if Google Chrome
      var accessTokenObj = {};
      accessTokenObj[accessTokenStorageKey] = token;
      localStorage.setItem(accessTokenObj, function(){
        deferred.resolve(true);
      });

      return deferred.promise;
    };

    var getAccessToken = function(){
      return loadAccessToken()
          .then( function(token){
            return token;
          })
          .catch( function(){
            return null;
          })
    };

    var logout = function(){
      accessToken = null;
      localStorage.removeItem(accessTokenStorageKey, function(){
        console.log('User is logged out.');
      });
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
          console.log(res);
          return setAccessToken(res.data.access_token)
            .then(function(d){
              return true;
            })
            .catch(function(d){
              return false;
            });
        })
        .catch(function(res) {
          console.log( res );
          return false;
        })
    };

    return{
      load: loadAccessToken, // load from the browser. Later on create the authAdapater.
      set: setAccessToken, // set access token. it also saves it to the browser.
      get: getAccessToken, // get access token.
      login: login, // login the user
      logout: logout, // logout the user
    }
  }]);