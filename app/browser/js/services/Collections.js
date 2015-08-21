'use strict';

/* Services */

angular.module('app')
  .factory('Collections', [
      '$rootScope',
      '$q',
      'ApiRequest',
      'Config',
      'Items',
      function($rootScope, $q, ApiRequest, Config, Items){
    var endpoint = 'collections';

    var Collection = {};
    /*
     * @params: key value pair of params
     */
    Collection.getAll = function(params){
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
    Collection.get = function(id){
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
    Collection.update = function(id, data){

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
     Collection.create = function(data){
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
     Collection.remove = function(id){
       var options = {
         'method': 'DELETE',
         'url': Config.url + Config.api + endpoint + '/' + id
       };
       return ApiRequest.send(options);
     };

    return Collection;
  }]);
