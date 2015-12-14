'use strict';

/* Services */

angular.module('app')
  .factory('EndpointHealth', [
    'Config',
    '$rootScope',
    'URI',
    function(Config, $rootScope, URI){
      var EndpointHealth = {};

      // Verify if mocked or not
      // 1 = true
      // 0 = false
      EndpointHealth.isMocked = function(url){
        if(url === undefined){
          return 0;
        }else{
          var parsedURL = URI.parse(url);
          if(parsedURL.hostname){
            return 1;
          }else{
            return 0;
          }
        }
      };


      return EndpointHealth;

  }]);
