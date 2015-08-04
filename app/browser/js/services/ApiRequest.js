'use strict';

/* Services */

angular.module('app')
  .factory('ApiRequest', ['$q', '$http', 'Auth', function($q, $http, Auth){
    var send = function(options){
      var headers = options.headers ? options.headers : {};
      var promises = [];
      // promises.push(
      //   Auth.get()
      //       .then( function(data){
      //         headers['Authorization'] = data;
      //       })
      // );

      return $q.all(promises)
        .then(function(){
          options.headers = headers;
          return $http(options)
            .then(function(res) {
              console.log(res);
              return res.data;
            })
            .catch(function(res) {
              // Log and/or show the error message
              console.log( res );
              return res;
            })
        })
        .catch(function(err){
          console.log(err);
        });
    };

    return{
      send:send
    };
  }]);
