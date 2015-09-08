'use strict';

/* Services */

angular.module('app')
  .factory('ProjectKeys', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'RequestUtility',
    'Config',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config){

      var projectsEndpoint = 'projects/';
      var keysEndpoint = 'keys';

      var Key = {};

      /*
      * @params: key value pair of params
      */
      Key.getAll = function(project_id, params){
        var url = Config.url + Config.api + projectsEndpoint + project_id + '/' + keysEndpoint;
        if(params) url += '?' + $.param(params) // jshint ignore:line
        var options = {
          'method': 'GET',
          'url': url
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      */
      Key.get = function(project_id, id){
        var options = {
          'method': 'GET',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + keysEndpoint + '/' + id
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      * @data: object fields and values
      */
      Key.update = function(project_id, id, data){

        var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + keysEndpoint + '/' + id,
          'data': data
        };

        return ApiRequest.send(options)
          .then(function(updateVariable){
            if(updateVariable){
              $rootScope.currentProject.keys[updateVariable.id] = updateVariable;

              helperUpdateVariableNameToAllEnvironments(
                $rootScope.currentProject.environments.public, updateVariable );

              helperUpdateVariableNameToAllEnvironments(
                $rootScope.currentProject.environments.private, updateVariable );

              return updateVariable;
            } else {
              throw updateVariable;
            }
          });
      };

      /*
      * @data: object fields and values
      */
      Key.create = function(project_id, data){
        var options = {
          'method': 'POST',
          'url': Config.url + Config.api + projectsEndpoint + project_id + '/' + keysEndpoint,
          'data': data
        };
        return ApiRequest.send(options)
          .then(function(data){
            if(!data.id) throw data;
              $rootScope.currentProject.keys[data.id] = data;

              helperAddVariableToAllEnvironments(
                $rootScope.currentProject.environments.public, data );

              helperAddVariableToAllEnvironments(
                $rootScope.currentProject.environments.private, data );

          });
      };

      /*
      * @id: project id
      */
      Key.remove = function(project_id, id){
        var options = {
          'method': 'DELETE',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + keysEndpoint + '/' + id,
        };
        return ApiRequest.send(options)
          .then(function(data){
            if( $rootScope.currentProject.keys[id] ){
              delete  $rootScope.currentProject.keys[id];
            }

            var envs = $rootScope.currentProject.environments;
            if( envs && envs.public ){
              _.forEach(envs.public, function(environment){
                delete environment.vars[id];
              });
            }

            if( envs && envs.private ){
              _.forEach(envs.private, function(environment){
                delete environment.vars[id];
              });
            }
          });
      };

      /*
       * @keysFromDB - Server response for Keys within a project.
       * returns an object with ProjectKey.id as Object key
       */
      Key.loadAll = function(ProjectKeysFromDB){
        return  _.reduce(ProjectKeysFromDB, function(result, key){
          if(key.id) result[key.id] = key;
          return result;
        }, {});
      };

      function helperUpdateVariableNameToAllEnvironments(environments, variable){
        _.forEach(environments, function(env){
          if(env.vars && env.vars[variable.id]){
            env.vars[variable.id].name = variable.name;
          }
        });
      }

      function helperAddVariableToAllEnvironments(environments, variable){
        _.forEach(environments, function(env){
          if(!env.vars) env.vars = {};

          var environmentKeyValue = {
            environment_id: env.id,
            name: variable.name,
            project_key_id: variable.id,
            value: ""
          };
          env.vars[variable.id] = environmentKeyValue;
        });
      }

      return Key;
    }

  ]);
