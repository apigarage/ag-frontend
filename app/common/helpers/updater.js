(function(){
  'use strict';
  var q = require('q');
  var config = require('../../vendor/electron_boilerplate/env_config');
  var running = false;

  module.exports.init = function(){
    setInterval(module.exports.check, 60 * 60 ); // Check for updates every hour.
  };

  module.exports.check = function(){
    try{
      if(!running){
        running = true;
        var d = new Date().toJSON();
        console.log('Checking for updates at : ', d);
      }
    }
    catch(err){}
    running = false;
  };

  module.exports.downloadUpdate = function(){
    // Download the app.asar file to tmp
  };

  module.exports.applyUpdate = function(){
    // replace app.asar with the updated app.asar
  };

})();
