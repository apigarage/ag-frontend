'use strict';

/* Services */

angular.module('app')
  .factory('Environments', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'RequestUtility',
    'Config',
    'ProjectKeyValues',
    function($rootScope, $q, _, ApiRequest, RequestUtility, Config,
      ProjectKeyValues){

      var projectsEndpoint = 'projects/';
      var environmentsEndpoint = 'environments';

      var Environment = {};
      /*
      * @params: key value pair of params
      */
      Environment.getAll = function(project_id, params){
        var url = Config.url + Config.api + projectsEndpoint + project_id + '/' + environmentsEndpoint;
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
      Environment.get = function(project_id, id){
        var options = {
          'method': 'GET',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + environmentsEndpoint + '/' + id
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      * @data: object fields and values
      */
      Environment.update = function(project_id, id, data){

        var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + environmentsEndpoint + '/' + id,
          'data': data
        };

        return ApiRequest.send(options)
          .then(function(updatedEnvironment){
            if(updatedEnvironment){
              $rootScope.currentProject.environments[updatedEnvironment.id] = updatedEnvironment;
              return updatedEnvironment;
            } else {
              throw updatedEnvironment;
            }
          });
      };

      /*
      * @data: object fields and values
      */
      Environment.create = function(project_id, data){
        var options = {
          'method': 'POST',
          'url': Config.url + Config.api + projectsEndpoint + project_id + '/' + environmentsEndpoint,
          'data': data
        };
        return ApiRequest.send(options)
          .then(function(data){
            if(!data.id) throw data;

            if(data.private){
              if( _.isEmpty( $rootScope.currentProject.environments.private )){
                $rootScope.currentProject.environments.private  = {};
              }
              $rootScope.currentProject.environments.private[data.id] =
                Environment.loadOne(data);
            } else {
              if( _.isEmpty( $rootScope.currentProject.environments.public )){
                $rootScope.currentProject.environments.public  = {};
              }
              $rootScope.currentProject.environments.public[data.id] =
                Environment.loadOne(data);
            }
          });
      };

      /*
      * @id: project id
      */
      Environment.remove = function(project_id, id){
        var options = {
          'method': 'DELETE',
          'url': Config.url + Config.api + projectsEndpoint + project_id +
            '/' + environmentsEndpoint + '/' + id,
        };
        return ApiRequest.send(options)
          .then(function(data){
            var envs = $rootScope.currentProject.environments;

            if( envs && envs.public && envs.public[id] )
              delete envs.public[id];

            if( envs && envs.private && envs.private[id] )
              delete envs.private[id];

          });
      };

      //
      // ****************************************************************
      //  currentProject.environments Management
      //  ****************************************************************


      Environment.loadAll = function(environmentsFromDB){

        if( _.isEmpty(environmentsFromDB) ) return {};

        // Transforming currentProject.environments from an array to an object.
        // environment_id will be the key.
        var environments = {};

        environments.private = _.reduce(environmentsFromDB, function(result, environment){
          if(environment.id && environment.private){
            result[environment.id] = Environment.loadOne(environment);
          }
          return result;
        }, {});

        environments.public = _.reduce(environmentsFromDB, function(result, environment){
          if(environment.id && !environment.private){
            result[environment.id] = Environment.loadOne(environment);
          }
          return result;
        }, {});

        if( _.isEmpty(environments.private) ) environments.private = undefined;
        if( _.isEmpty(environments.public) ) environments.public = undefined;

        return environments;
      };

      Environment.loadOne = function(environmentFromDB){
        environmentFromDB.vars = ProjectKeyValues.loadAll(environmentFromDB.vars);
        return environmentFromDB;
      };

      return Environment;
    }

  ]);
