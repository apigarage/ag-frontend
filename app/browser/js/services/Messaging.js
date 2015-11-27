//const ipc = require('ipc');

angular.module('app')
  .factory('Messaging', [ 'ipc', function(ipc){
    var Messaging = {};

    Messaging.send = function(message){
      // TODO: ipc.send(message.eventName, message);
    };

    Messaging.sendSync = function(message){
      message.messageEvent = "ag-message";
      ipc.sendSync(message.messageEvent, message);
    };

    Messaging.sendToHost = function(message){
      // TODO: ipc.sendToHost(message.eventName, message)
    };

  return Messaging;

  }])
  .run(['$rootScope', 'ipc',
    function($rootScope, ipc) {

      // API Garage Message broadcast service
      ipc.on('ag-message', function(data) {
        //console.log('ag-message', data);
        try {
          $rootScope.$broadcast(data.eventName, data);
        } catch (e) {
            console.log(e);
        } finally {
        }
      });

      // ipc.on('server-request', function(request) {
      //   console.log('Request', request);
      //   // TODO: prints out request in a SERVER LOG
      //   try {
      //     $rootScope.$broadcast('mocking-server-request', request);
      //   } catch (e) {
      //       console.log(e);
      //   } finally {
      //
      //   }
      // });
      //
      // ipc.on('server-Response', function(response) {
      //   console.log('response', response);
      //   // TODO: prints out responses in a SERVER LOG
      //   try {
      //     $rootScope.$broadcast('mocking-server-response', response);
      //   } catch (e) {
      //       console.log(e);
      //   } finally {
      //
      //   }
      // });


    }
  ]);
