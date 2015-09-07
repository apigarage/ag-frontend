'use strict';

/* Services */

angular.module('app')
  .factory('ProjectKeyValues', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'RequestUtility',
    'Config',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config){

      var projectsEndpoint = 'projects/';
      var keysEndpoint = 'keys/';
      var environmentsEndpoint = 'environments';

      var ProjectKeyValue = {};

      /*
      * @id: project id
      * @data: object fields and values
      */
      ProjectKeyValue.update = function(projectId, keyId, environmentId, data){

        var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + projectsEndpoint + projectId +
            '/' + keysEndpoint + keyId + '/' + environmentsEndpoint + '/' + environmentId,
          'data': data
        };
        return ApiRequest.send(options);
      };

      ProjectKeyValue.loadAll = function( projectKeyValuesFromDB ){
        // Transforming environments.vars from an array to an object.
        // project_key_id will be the key.
        return _.reduce(projectKeyValuesFromDB, function(varResult, variable){
          varResult[variable.project_key_id] = variable;
          return varResult;
        }, {});
      };

      return ProjectKeyValue;
    }

  ]);
