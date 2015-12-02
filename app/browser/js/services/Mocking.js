'use strict';

/* Services */

angular.module('app')
  .factory('Mocking', [ '$window', '$rootScope', 'Config', 'ApiRequest', 'Auth', 'Messaging', 'ipc',
  function($window, $rootScope, Config, ApiRequest, Auth, Messaging, ipc){

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
       Mocking.port =  parseInt(localStorage.getItem('defaultPort'));
     }

    Mocking.startServer = function (port){
      var message = {
        "eventName" : 'start-mocking-server',
        "port" : port,
        "endpoints": $rootScope.currentProject.collections,
        "projectId": $rootScope.currentProject.id,
        "accessToken": Auth.get()
      };
      localStorage.setItem("defaultPort", port);
      Mocking.port = port;
      Mocking.serverStatus = true;
      Messaging.sendSync(message);
    };

    Mocking.stopServer = function (){
      var message = {
        "eventName" : 'stop-mocking-server',
      };
      Mocking.serverStatus = false;
      Messaging.sendSync(message);
    };


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
