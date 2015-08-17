'use strict';

/* Services */

angular.module('app')
  .factory('ApiRequest', ['$q', '$http', 'Auth', '$window', function($q, $http, Auth, $window){
    /*
     * @options = options for the http / https comments
     * @dataOnly = If true, only response data is returned. Default is true.
     */
    var send = function(options, dataOnly){
      if(dataOnly === undefined) dataOnly = true;

      $http.defaults.headers.common = {};
      var headers = options.headers ? options.headers : {};
      var authorization = Auth.get();
      if(authorization) headers.Authorization = authorization;

      options.headers = headers;
      return $http(options)
        .then(function(res) {
          if(dataOnly) return res.data;
          return res;
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
