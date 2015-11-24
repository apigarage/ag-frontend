'use strict';

/* Services */

angular.module('app')
  .factory('Mocking', [ '$window', '$rootScope', 'Config', 'ipc', 'ApiRequest',
  function($window, $rootScope, Config, ipc, ApiRequest){

    var Mocking = {};
    var localStorage = $window.localStorage;

    Mocking.serverStatus = undefined;
    // TODO - Add this to config file.
    Mocking.port = 41443;

    if(localStorage.getItem('defaultPort') === undefined ||
    localStorage.getItem('defaultPort') === "null" ||
    localStorage.getItem('defaultPort') === null ){
       Mocking.port = 41443; // default port save to localStorage
     }else{
       Mocking.port =  localStorage.getItem('defaultPort');
     }

    Mocking.startServer = function (port){
      ipc.sendSync('start-server', {
        'port': port,
        'endpoints': $rootScope.currentProject.collections
      });
      Mocking.serverStatus = true;
      $rootScope.$broadcast('updateServerStatus', Mocking.serverStatus);
    };

    Mocking.stopServer = function (){
      ipc.sendSync('stop-server', 'node');
      Mocking.serverStatus = false;
      $rootScope.$broadcast('updateServerStatus', Mocking.serverStatus);
    };


    ipc.on('server-request', function(request) {
      console.log('Request', request);
      // TODO: prints out request in a SERVER LOG
    });

    ipc.on('server-Response', function(response) {
      console.log('response', response);
      // TODO: prints out responses in a SERVER LOG
    });

    ipc.on('start-server', function(port) {
      console.log('server-started', port);
    });

    ipc.on('stopped-server', function(port) {
      console.log('server-stopped', port);
    });

    //======== Mocking Calls ===========///
    var endpoint = 'items';
    var mockedResponses = 'responses';

    Mocking.getAll = function(endpointUuid){
      var options = {
        'method': 'GET',
        'url': Config.url + Config.api + endpoint + '/'  + endpointUuid + '/' + mockedResponses ,
        'data': endpointUuid
      };
      return ApiRequest.send(options);
    };

    Mocking.update = function(item, data){
      var options = {
        'method': 'PUT',
        'url': Config.url + Config.api + endpoint + '/' + item.uuid + '/' + mockedResponses + '/' + data.uuid,
        'data': data
      };
      return ApiRequest.send(options);
    };

    Mocking.create = function(item, response){
      response.headers = {};
      response.description = "";

      var options = {
        'method': 'POST',
        'url': Config.url + Config.api + endpoint + '/' + item.uuid + '/' + mockedResponses,
        'data': response
      };
      return ApiRequest.send(options);
    };

    Mocking.remove = function(item, data){
      var options = {
        'method': 'DELETE',
        'url': Config.url + Config.api + endpoint + '/' + item.uuid + '/' + mockedResponses + '/' + data.uuid,
        'data': data
      };
      return ApiRequest.send(options);
    };
    return Mocking;

  }]);
