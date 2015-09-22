(function(){
  var conf = require('../vendor/electron_boilerplate/env_config');
  var ipc = require('ipc');
  var wm = require('../common/helpers/windowsManager.js');
  var running = false;

  module.exports = function(){
    console.log('Starting the Sync');
    setInterval(syncAgain, conf.syncTime);
  };

  function syncAgain(){
    if(!running){
      running = true;
      var d = new Date().toJSON();
      wm.sendToAllWindows('last-synced-at', d);
      // console.log('Syncing Again ... ' + d );
      // ipc.send('last-synced-at', d);
      // ALL THE SYNCING GOES HERE.
      // UPDATE THE VIEW OBJECT.
      running = false;
    }
  }
})();
