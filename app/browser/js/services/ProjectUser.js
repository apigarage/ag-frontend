'use strict';

/* Services */

angular.module('app')
  .factory('ProjectsUser', [ 'ApiRequest', 'Config', function(ApiRequest, Config){
    var endpoint = 'projects';
    var ProjectsUser = {};

    /* @id: project id
       @data: email data */
    ProjectsUser.shareProject = function(id, data){
      var options = {
        'method': 'PUT',
        'url': Config.url + Config.api + endpoint + '/' + id,
        'data': data
      };
      return ApiRequest.send(options, false);
    };

    /* @id: project id */
    ProjectsUser.shareProjectUsers = function(id){
      var option = 'users';
      var options = {
        'method': 'GET',
        'url': Config.url + Config.api + endpoint + '/' + id + '/' + option
      };
      return ApiRequest.send(options, false);
    };

    /* @id: project id
       @userId
       @data: permission_id
    */
    ProjectsUser.updateProjectUserPermission = function(id, userId, data){
      var option = 'users';
      var options = {
        'method': 'PUT',
        'url': Config.url + Config.api + endpoint + '/' + id + '/' + option + '/' + userId ,
        'data': data
      };
      return ApiRequest.send(options, false);
    };

    /* @id: project id
       @userId
       @data: email address
    */
    ProjectsUser.removeProjectUser = function(id, userId, data){
      var option = 'users';
      var options = {
        'method': 'DELETE',
        'url': Config.url + Config.api + endpoint + '/' + id + '/' + option + '/' + userId ,
        'data': data
      };
      return ApiRequest.send(options, false);
    };

    return ProjectsUser;

  }]);
