(function(){
  'use strict';
  var os = require('os');
  var app = require('app');
  var q = require('q');
  var semver = require('semver');
  var http = require('http');
  var fs = require('original-fs');
  var childProcess = require('child_process');

  var Config = require('../../vendor/electron_boilerplate/env_config');
  var request = require('./request');
  var utils = require('../../vendor/app_utils.js');

  var running = false;

  var updateUrl = Config.manifest_file_url;
  var updateCheckInterval = Config.update_check_interval;

  //console.log('updateUrl', updateUrl);
  //console.log('updateCheckInterval', updateCheckInterval);

  module.exports.init = function(){
    //console.log('Initializing Updater');
    start();
    setInterval(start, updateCheckInterval);
  };

  function start(){
    //console.log(utils.os());
    if(utils.os() !== 'osx' ){
      //console.log('Auto Updates are only supported for osx and you are running ' + utils.os());
      return;
    }

    if(running){
      //console.log('updater is running already.');
      return;
    }

    running = true;
    var d = new Date().toJSON();
    //console.log('Running updater at : ', d);

    return checkForUpdates()
      .finally(function(){
        running = false;
      });
  }

  var checkForUpdates = module.exports.checkForUpdates = function(){
    //console.log('Checking for updates online.');
    try{
      var options = {
        url: updateUrl,
        method: 'get'
      };
      return request.send(options).then(function(response){
        if(!response) throw new Error('Having issues with getting manifest file.');
        if(!response.raw_body) throw new Error('Having issues with getting manifest file raw body.');

        var remoteManifestJSON = JSON.parse(response.raw_body);
        //console.log('Latest online version is: ', remoteManifestJSON.version);
        //console.log('Current app version is: ', app.getVersion());

        if(semver.lt(app.getVersion(), remoteManifestJSON.version)){
          //console.log('Update is available.');

          return downloadUpdate(remoteManifestJSON.updates.linkToLatest, true)
          .then(function(destination){
            return applyUpdate(destination);
          })
          .then(function(){
            //console.log('update is applied');
          })
          .catch(function(error){
            //console.log('Update was not applied.');
            //console.log(error);
          });
        }

        //console.log('Already running at the latest version');
      }).catch(function(err){
        //console.log(err);
      });
    } catch(err) {
      //console.log(err);
      //console.log('Checking for updates failed...');
      return q.resolve();
    }
  };

  var downloadUpdate = module.exports.downloadUpdate = function(downloadUrl, updateRightAway){

    var deferred = q.defer();

    //console.log('os.tmpdir()  ', os.tmpdir());
    var destination = os.tmpdir() + '/apigarage'; // Changing the file name.
    //console.log('will be saving the update at ', destination);

    var file = fs.createWriteStream(destination);
    //console.log('Downloading the update from ', downloadUrl);

    var request = http.get(downloadUrl, function(response){
      response.pipe(file);
      file.on('finish', function(){
        //console.log('Finished downloading the update.');
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
    //console.log('Applying Update');

    var deferred = q.defer();
    var destinationFile = utils.getAppAsarDirectoryPath() + '/app.update';

    var cmd = 'cp ' + srcAsarFile + ' \'' + destinationFile + '\'';

    // jetpack.copy(srcAsarFile, './somefile.asar'); // fs-jetpack does not support asar files.
    // That's we have to move the asar file using mv command.
    childProcess.exec(cmd, function(error, stdout, stderr){
        if( error ) return deferred.reject(error);
        else deferred.resolve();
    });

    return deferred.promise;

    // TODO : Emit (restart required)
  };

})();
