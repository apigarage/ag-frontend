'use strict';

/* Services */

angular.module('app')
  .factory('Mocking', ['Config', 'ipc', function(Config, ipc){

    var Mocking = {};

    Mocking.startServer = function (port){
      ipc.sendSync('start-server', { 'port': port});
    };

    Mocking.stopServer = function (){
      ipc.sendSync('stop-server', 'node');
    };


    ipc.on('server-request', function(request) {
      console.log('Request', request);
      // TODO: prints out request in a SERVER LOG
      //
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

    return Mocking;

  }]);
