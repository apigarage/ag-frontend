'use strict';

/* Services */

angular.module('app')
  .factory('Items', [
      '$rootScope',
      '$q',
      'lodash',
      'ApiRequest',
      'UUID',
      'Config',
      function($rootScope, $q, _, ApiRequest, UUID, Config){
    var endpoint = 'items';

    var Item = {};
    /*
     * @params: key value pair of params
     */
    Item.getAll = function(params){
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
    Item.get = function(id){
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
    Item.update = function(id, data){

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
     Item.create = function(data){
       data.uuid = UUID.generate();
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
     Item.remove = function(id){
       var options = {
         'method': 'DELETE',
         'url': Config.url + Config.api + endpoint + '/' + id
       }; return ApiRequest.send(options);
     };

     Item.loadAll = function(itemsFromDB){
       return _.reduce(itemsFromDB, function(itemResult, item){
         if(item.uuid){
           itemResult[item.uuid] = item;
         }
         return itemResult;
       }, {});
     };

    return Item;
  }]);
