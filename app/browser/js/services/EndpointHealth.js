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
        if(!url) return 0;

        // Trimming the protocol because mocking does not use it. Also, it allows environment variables on the protocol field. Example: `{{protocol}}://{{host}}:{{port}}/path-to-endpoint`
        var halfUrl = url.substr(url.indexOf("://"));

        var parsedURL = URI.parse(halfUrl);
        return !!parsedURL.hostname;
      };


      return EndpointHealth;

  }]);
