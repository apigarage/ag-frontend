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
    
    var getCurrentUserInformation = function(){
      var option = 'users';
      var options = {
        'method': 'GET',
        'url': Config.url + Config.api + 'me'
      };
      return ApiRequest.send(options, true);
    };

    return{
      create : create,
      getCurrentUserInformation : getCurrentUserInformation
    };

  }]);
