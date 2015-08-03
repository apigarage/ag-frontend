'use strict';

/* Services */

angular.module('app')
  .factory('Projects', ['$q', 'ApiRequest', 'Config', '$rootScope', function($q, ApiRequest, Config, $rootScope){
    var endpoint = 'projects';
    // var _data = null;

    // var load = function(){
    //   if( !_data ) {
    //     return getAll(null).then(function(data){
    //       _data = data;
    //     });
    //   }
    // };

    /* @params: key value pair of params */
    var getAll = function(params){
      var url = Config.url + Config.api + endpoint;
      if(params) url += '?' + $.param(params)
      var options = {
          'method': 'GET',
          'url': url
      };
      return ApiRequest.send(options);
    };

    var get = function(id){
      var options = {
          'method': 'GET',
          'url': Config.url + Config.api + endpoint + '/' + id
      };
      return ApiRequest.send(options);
    };

    /* @data: object fields and values */
    var update = function(id, data){

      var options = {
          'method': 'PATCH',
          'url': Config.url + Config.api + endpoint + '/' + id,
          'data': data
      };
      return ApiRequest.send(options);
    };

    var updateAll = function(){
      return getAll()
      .then(function(data){
        $rootScope.projects = data;
        // update selected project
        var updated = false;
        for(var i =0 ; i < data.length ; i++ ){
          if($rootScope.selectedProject &&
             $rootScope.projects[i].id == $rootScope.selectedProject.id){
            $rootScope.selectedProject = $rootScope.projects[i];
            updated  = true;
          }
        }
        // if it is not updated that means project was deleted
        if(!updated && $rootScope.projects.length > 0){
          $rootScope.selectedProject = $rootScope.projects[0];
        } else if(!updated){
          $rootScope.selectedProject = null;
        }
      });
    }
     /* @data: object fields and values */
    var create = function(data){
      var options = {
          'method': 'POST',
          'url': Config.url + Config.api + endpoint,
          'data': data
      };
      return ApiRequest.send(options)
                      .then(function(data){
                        return data;
                      });
    };

    var remove = function(id){

      var options = {
          'method': 'DELETE',
          'url': Config.url + Config.api + endpoint + '/' + id
      };
      return ApiRequest.send(options);
    };
    return{
      get:get,
      getAll:getAll,
      update:update,
      updateAll:updateAll,
      create:create,
      remove:remove,
      // load:load,
      // addRequest:addRequest,
      // updateRequest:updateRequest,
      // reset:reset,
      // data: function(){ return _data; }
    };

  }]);