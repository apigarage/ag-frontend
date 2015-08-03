'use strict';

/* Services */

angular.module('app')
  .factory('Users', [ 'ApiRequest', 'Config', function(ApiRequest, Config){
    var endpoint = 'users';

     /* @data: object fields and values */
    var create = function(data){      
      var options = {
          'method': 'POST',
          'url': Config.url + Config.api + endpoint,
          'data': data
      };
      return ApiRequest.send(options)
                      .then(function(data){
                        return data;
                      });
    };
    return{     
      create:create     
    };

  }]);