(function(){
  'use strict';
  var app = require('app');
  var q = require('q');
  var semver = require('semver');

  var config = require('../../vendor/electron_boilerplate/env_config');
  var request = require('./request');

  var running = false;

  var updateUrl = 'http://0.0.0.0:8080/package.json';
  var updateCheckInterval = 60 * 60 * 1000 ;


  module.exports.init = function(){
    console.log('Initializing Updater');
    start();
    setInterval(start, updateCheckInterval);
  };

  function start(){
    if(running){
      console.log('updater is running already.');
      return;
    }

    running = true;
    var d = new Date().toJSON();
    console.log('Running updater at : ', d);

    return module.exports.checkForUpdates()
      .finally(function(){
        running = false;
      });
  }

  module.exports.checkForUpdates = function(){
      try{

        var options = {
          url: updateUrl,
          method: 'get'
        };

        console.log('Checking for updates online.');
        return request.send(options).then(function(response){
          if(response && response.body && response.body.latestVersion ){
            // console.log('Latest online version is: ', response.body.latestVersion);
            // console.log('Current app version is: ', app.getVersion());
            var updateAvailable =  semver.lt(app.getVersion(), response.body.latestVersion);
            if(updateAvailable){
              console.log('Update is available.');
              return downloadUpdate();
            }
          }
          console.log('Already running at the latest version');
        });
      }
      catch(err){
        console.log('Checking for updates failed...');
        return q.resolve();
      }
  };


  module.exports.downloadUpdate = function(){
    // Download the app.asar file to tmp
    // TODO - Emit Update Downloaded
  };

  module.exports.applyUpdate = function(){
    // replace app.asar with the updated app.asar
  };

})();
