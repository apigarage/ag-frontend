'use strict';

/* Services */

angular.module('app')
  .factory('ApiRequest', ['$q', '$http', 'Auth', '$window', function($q, $http, Auth, $window){
    var send = function(options){
      $http.defaults.headers.common = {};
      var headers = options.headers ? options.headers : {};
      var authorization = Auth.get();
      if(authorization) headers.Authorization = authorization;

      options.headers = headers;
      return $http(options)
        .then(function(res) {
          return res.data;
        })
        .catch(function(res) {
          // Log and/or show the error message
          $window.console.log(res);
          return res;
        });
    };

    return{
      send:send
    };
  }]);
