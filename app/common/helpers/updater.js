(function(){
  'use strict';
  var os = require('os');
  var app = require('app');
  var q = require('q');
  var semver = require('semver');
  var http = require('http');
  var fs = require('fs');

  var config = require('../../vendor/electron_boilerplate/env_config');
  var request = require('./request');

  var running = false;

  var updateUrl = 'http://0.0.0.0:8081/package.json';
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
        console.log('Checking for updates online.');

        var options = {
          url: updateUrl,
          method: 'get'
        };
        return request.send(options).then(function(response){
          if(response && response.body && response.body.latestVersion ){
            console.log('Latest online version is: ', response.body.latestVersion);
            console.log('Current app version is: ', app.getVersion());
            var updateAvailable =  semver.lt(app.getVersion(), response.body.latestVersion);

            if(updateAvailable){
              console.log('Update is available.');
              return module.exports.downloadUpdate(response.body.latestAsar, true);
            }
          }

          console.log('Already running at the latest version');
        }).catch(function(err){
          console.log(err);
        });
      }
      catch(err){
        console.log(err);
        console.log('Checking for updates failed...');
        return q.resolve();
      }
  };

  module.exports.downloadUpdate = function(downloadUrl, updateRightAway){

    var deferred = q.defer();

    console.log('os.tmpdir()  ', os.tmpdir());
    var destination = os.tmpdir() + '/apigarage.update';
    console.log('will be saving the update at ', destination);

    var file = fs.createWriteStream(destination);
    console.log('Downloading the update from ', downloadUrl);

    var request = http.get(downloadUrl, function(response){
      response.pipe(file);
      file.on('finish', function(){
        console.log('Finished downloading the update.');
        file.close(deferred.resolve);
        // TODO - Emit Update Downloaded
      });
    }).on('error', function(err){
      fs.unlink(destination);
      deferred.reject();
    });

    return deferred.promise;
  };

  module.exports.applyUpdate = function(){
    // replace app.asar with the updated app.asar
  };

})();
