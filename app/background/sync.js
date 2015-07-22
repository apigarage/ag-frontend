var conf = require('../vendor/electron_boilerplate/env_config');
var utils = require('../utils.js');
var ipc = require('ipc');
var wm = require('../windowsManager.js');
var running = false;

module.exports = function(){
  console.log('Starting the Sync');
  setInterval(syncAgain, conf.syncTime);
};

function syncAgain(){
  if(!utils.areWeOnline()){
    console.log('We are not online. Cannot sync.');
    return;
  }
  if(!running){
    running = true;
    var d = new Date().toJSON();
    wm.sendToAllWindows('last-synced-at', d);
    console.log('Syncing Again ... ' + d );
    // ipc.send('last-synced-at', d);
    // ALL THE SYNCING GOES HERE.
    // UPDATE THE VIEW OBJECT.
    running = false;
  }
}
