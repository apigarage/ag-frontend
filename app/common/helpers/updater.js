(function(){
  'use strict';
  var os = require('os');
  var app = require('app');
  var q = require('q');
  var semver = require('semver');
  var http = require('http');
  var fs = require('fs');
  var childProcess = require('child_process');

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

    return checkForUpdates()
      .finally(function(){
        running = false;
      });
  }

  var checkForUpdates = module.exports.checkForUpdates = function(){
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
              return downloadUpdate(response.body.latestAsar, true)
                .then(function(destination){
                  applyUpdate(destination);
                  console.log("I M HERE");
                });
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

  var downloadUpdate = module.exports.downloadUpdate = function(downloadUrl, updateRightAway){

    var deferred = q.defer();

    console.log('os.tmpdir()  ', os.tmpdir());
    var destination = os.tmpdir() + '/apigarage'; // Changing the file name.
    console.log('will be saving the update at ', destination);

    var file = fs.createWriteStream(destination);
    console.log('Downloading the update from ', downloadUrl);

    var request = http.get(downloadUrl, function(response){
      response.pipe(file);
      file.on('finish', function(){
        console.log('Finished downloading the update.');
        file.close(function(){
          return deferred.resolve(destination);
        });
        // TODO - Emit Update Downloaded
      });
    }).on('error', function(err){
      fs.unlink(destination);
      deferred.reject();
    });

    return deferred.promise;
  };

  var applyUpdate = module.exports.applyUpdate = function(srcAsarFile){
    console.log('Applying Update');

    var deferred = q.defer();

    var cmd = 'cp ' + srcAsarFile + ' .';

    // jetpack.copy(srcAsarFile, './somefile.asar'); // fs-jetpack does not support asar files.
    // That's we have to move the asar file using mv command.
    childProcess.exec(cmd, function(error, stdout, stderr){
        if( error ) return deferred.reject(error);
        else deferred.resolve();
    });

    return deferred.promise;

    // TODO : Emit (restart required)
})();
