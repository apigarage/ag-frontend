(function(){
  var events = require('events');
  var eventEmitter = new events.EventEmitter();
  var ipc = require('ipc');

  var windowsManager  = require('./windowsManager.js');
  var serverManager  = require('./serverManager.js');

  module.exports.messageHandler = function(){
    ipc.on("ag-message", function(event, data){
      eventEmitter.emit(data.eventName, data);
      event.returnValue = data;
    });
  };

  eventEmitter.on('start-mocking-server', function(data){
   serverManager.createServer(data)
     .then(function(data){
       windowsManager.sendToAllWindows('ag-message', data);
     });
  });

  eventEmitter.on('stop-mocking-server', function(data){
    serverManager.stopServer();
    windowsManager.sendToAllWindows('ag-message', data);
  });

  eventEmitter.on('test-response-mocking-server', function(data){
    console.log('data', data);
    if(data.serverStatus){
      console.log('serverStatus', data);
      serverManager.createServer(data.serverMessage)
        .then(function(serverData){
          console.log('serverData', serverData);
          windowsManager.sendToAllWindows('ag-message', serverData);
          serverManager.testMockingCall(data);
          windowsManager.sendToAllWindows('ag-message', data);
        });
    }else{
      serverManager.testMockingCall(data);
      windowsManager.sendToAllWindows('ag-message', data);
    }
  });



})();
