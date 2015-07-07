var conf = require('../vendor/electron_boilerplate/env_config');
var utils = require('../utils.js');

var running = false;

module.exports = function(){
  console.log('Starting the Sync');
  setInterval(syncAgain, conf.syncTime);
}

function syncAgain(){
  if(!utils.areWeOnline()){
    console.log('We are not online. Cannot sync.');
    return;
  }
  if(!running){
    running = true;
    console.log('Syncing Again ... ' + (new Date().toJSON()) );
    // ALL THE SYNCING GOES HERE.
    // UPDATE THE VIEW OBJECT.
    running = false;
  }
}
