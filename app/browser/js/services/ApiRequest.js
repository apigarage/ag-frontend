'use strict';

/* Services */

angular.module('app')
  .factory('ApiRequest', ['$q', '$http', 'Auth', '$window', function($q, $http, Auth, $window){
    var send = function(options){
      var headers = options.headers ? options.headers : {};
      var promises = [];
      headers.Authorization = Auth.get();

      return $q.all(promises)
        .then(function(){
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
        })
        .catch(function(err){
        });
    };

    return{
      send:send
    };
  }]);
