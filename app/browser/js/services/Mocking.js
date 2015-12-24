'use strict';

/* Services */

angular.module('app')
  .factory('Mocking', [ '$window', '$rootScope', 'URI', 'lodash', '$http',
    'Config', 'ApiRequest', 'Auth', 'Messaging', 'ipc',
    'RequestUtility',
  function($window, $rootScope, URI, _, $http, Config, ApiRequest,
    Auth, Messaging, ipc, RequestUtility){

    var Mocking = {};
    var localStorage = $window.localStorage;
    var localhost = 'http://localhost'

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

    $rootScope.$on('start-mocking-server', function(evt, data){
      Mocking.port = data.port;
      Mocking.serverStatus = true;
    });

    Mocking.startServer = function (port){
      if(!port) port = parseInt(localStorage.getItem('defaultPort'));

      var message = {
        "eventName" : 'start-mocking-server',
        "port" : port,
        "endpoints": $rootScope.currentProject.collections,
        "projectId": $rootScope.currentProject.id,
        "accessToken": Auth.get()
      };
      localStorage.setItem("defaultPort", port);

      return Messaging.send(message);
      // .then(function(data){
      //
      // });
    };

    $rootScope.$on('stop-mocking-server', function(evt, data){
      Mocking.serverStatus = false;
    });

    Mocking.stopServer = function (){
      var message = {
        "eventName" : 'stop-mocking-server'
      };

      Messaging.send(message);
    };

    var mockingOptions;
    $rootScope.$on('test-response-mocking-server', function(evt, data){
      console.log('mockingOptions', mockingOptions);
      $http(mockingOptions).then(function(data){
        console.log('testdata', data);
      })
    });

    Mocking.testMockingCall = function(endpoint, testMockingResponse){

      // if the server is off
      // turn it on
      // if(!){
      //   Mocking.startServer();
      // }

      // send endpoint data with responses
      var headerKeyIsFound = false;
      _.forEach(endpoint.requestHeaders, function(header, value){
        console.log('key', header.key);
        console.log('value', value);
        if(header.key == 'x-ag-expected-status'){
          endpoint.requestHeaders[value].value = testMockingResponse.status;
          headerKeyIsFound = true;
        }
      })

      if(!headerKeyIsFound){
        endpoint.requestHeaders.push({
          key : 'x-ag-expected-status',
          value: testMockingResponse.status
        });
      }

      var port;

      if(!port) port = parseInt(localStorage.getItem('defaultPort'));

      var serverMessage = {
        "eventName" : 'start-mocking-server',
        "port" : port,
        "endpoints": $rootScope.currentProject.collections,
        "projectId": $rootScope.currentProject.id,
        "accessToken": Auth.get()
      };

      var mockingMessage
//      [] = testMockingResponse.status;
      var serverStatus = Mocking.serverStatus ? false : true;
      console.log('requestHeaders', endpoint.requestHeaders);
      var mockingMessage = {
        "eventName" : 'test-response-mocking-server',
        "testMockingResponse" : testMockingResponse,
        "endpoint": endpoint,
        "serverMessage": serverMessage,
        "serverStatus": serverStatus
      };

      console.log('message', mockingMessage);
      Messaging.send(mockingMessage, function(){
        // build the call options
        // make the call
        mockingOptions = {
          method: endpoint.requestMethod,
          url: endpoint.requestUrl,
          headers: endpoint.requestHeaders,
          data: endpoint.requestBody,
        };
        mockingOptions = RequestUtility.buildRequest(mockingOptions, $rootScope.currentEnvironment);
        console.log('test');

      });



    }

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
