'use strict';

/* Services */

angular.module('app')
  .factory('Projects', [
      '$q',
      'ApiRequest',
      'Config',
      '$rootScope',
      function($q, ApiRequest, Config, $rootScope){
    var endpoint = 'projects';

    var Project = {};
    /*
     * @params: key value pair of params
     */
    Project.getAll = function(params){
      var url = Config.url + Config.api + endpoint;
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
    Project.get = function(id){
      var options = {
        'method': 'GET',
        'url': Config.url + Config.api + endpoint + '/' + id
      };
      return ApiRequest.send(options);
    };

    /*
     * @id: project id
     * @data: object fields and values
     */
    Project.update = function(id, data){

      var options = {
        'method': 'PATCH',
        'url': Config.url + Config.api + endpoint + '/' + id,
        'data': data
      };
      return ApiRequest.send(options);
    };

    /*
     * @data: object fields and values
     */
     Project.create = function(data){
       var options = {
         'method': 'POST',
         'url': Config.url + Config.api + endpoint,
         'data': data
       };
       return ApiRequest.send(options);
     };

    /*
     * @id: project id
     */
     Project.remove = function(id){
       var options = {
         'method': 'DELETE',
         'url': Config.url + Config.api + endpoint + '/' + id
       };
       return ApiRequest.send(options);
     };

    /*
     * @id: retrieves the project, and sets it to currentProject on rootScope
     */
    Project.loadProjectToRootScope = function(id){
      return Project.get(id)
        .then(function(projectData){
          // If there is any project transformations, it should happen here.
          $rootScope.currentProject = projectData;
        });
    };

    return Project;
  }]);
