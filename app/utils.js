(function(){

  var ipc = require('ipc');

  // Online - Offline Status.
  var status = 'offline';
  ipc.on('online-status-changed', function(event, incomingStatus) {
    status = incomingStatus;
    console.log(status);
  });

  module.exports.areWeOnline = function(){
    return status == 'online';
  };

})();
