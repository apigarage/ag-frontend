'use strict';

/* Services */

angular.module('app')
  .factory('Activities', [
    '$rootScope',
    '$q',
    'lodash',
    'ApiRequest',
    'Config',
    function($rootScope, $q, _, ApiRequest, Config){

      var itemsEndpoint = 'items/';
      var activitiesEndpoint = 'activities';

      var Activity = {};

      /*
      * Activities - read comments related to an item
      * @item_id: uuid of the item
      */
      Activity.getAll = function(item_id){
        // {{server-url}}/api/items/{{local-endpoint-uuid}}/activities
        var url = Config.url + Config.api + itemsEndpoint + item_id + '/' + activitiesEndpoint;
        //if(params) url += '?' + $.param(params) // jshint ignore:line
        var options = {
          'method': 'GET',
          'url': url
        };
        return ApiRequest.send(options);
      };

      /*
      * @data: object fields and values
      */
      Activity.create = function(item_id, data){
        var options = {
          'method': 'POST',
          'url': Config.url + Config.api + itemsEndpoint + item_id + '/' + activitiesEndpoint,
          'data': data
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      */
      Activity.get = function(item_id, id){
        var options = {
          'method': 'GET',
          'url': Config.url + Config.api + itemsEndpoint + item_id +
            '/' + activitiesEndpoint + '/' + id
        };
        return ApiRequest.send(options);
      };

      /*
      * @id: project id
      * @data: object fields and values
      */
      Activity.update = function(item_id, id, data){

        var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + itemsEndpoint + item_id +
            '/' + activitiesEndpoint + '/' + id,
          'data': data
        };

        return ApiRequest.send(options);
      };



      /*
      * @id: project id
      */
      Activity.remove = function(item_id, id){
        var options = {
          'method': 'DELETE',
          'url': Config.url + Config.api + itemsEndpoint + item_id +
            '/' + activitiesEndpoint + '/' + id,
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


      return Activity;
    }

  ]);
