'use strict';

/* Services */

angular.module('app')
  .factory('Collections', [
      '$rootScope',
      '$q',
      'lodash',
      'ApiRequest',
      'Config',
      'Items',
      function($rootScope, $q, _, ApiRequest, Config, Items){
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
     * @id: collection id
     */
    Collection.get = function(id){
      var options = {
        'method': 'GET',
        'url': Config.url + Config.api + endpoint + '/' + id
      };
      return ApiRequest.send(options);
    };

    /*
     * @id: collection id
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
     * @id: collection id
     */
     Collection.remove = function(id){
       var options = {
         'method': 'DELETE',
         'url': Config.url + Config.api + endpoint + '/' + id
       };
       return ApiRequest.send(options);
     };

     Collection.loadAll = function(collectionsFromDB){

       // Transforming project.collections from an array to an object.
       // collection_id will be the key.
       return _.reduce( collectionsFromDB, function(result, collection){
         if(collection.id){

           collection.items = Items.loadAll(collection.items);
           result[collection.id] = collection;

         }
         return result;
       }, {});
     };

    return Collection;
  }]);
