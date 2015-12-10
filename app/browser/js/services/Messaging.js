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
          // if wer are dealing with a promise data rootScope apply
          if(data.eventName == "start-mocking-server" ||
            data.eventName == "update-mocking-logs"){
            $rootScope.$apply();
          }
        }
      });

    }
  ]);
