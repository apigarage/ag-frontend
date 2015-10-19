var q = require('q');
var originalFs = require('original-fs');
var os = require('os');
var argv = require('yargs').argv;
var Config = require('./electron_boilerplate/env_config');
// This function is a copy of apigarage-electron-client/tasks/utils.js
// We made it inside the app folder so that this function can be used by the application.
module.exports.os = function () {
  switch (os.platform()) {
    case 'darwin':
      return 'osx';
    case 'linux':
      return 'linux';
    case 'win32':
      return 'windows';
  }
  return 'unsupported';
};

module.exports.getEnvName = function () {
  return argv.env || 'development';
};

module.exports.renameFile = function(oldFilepath, newFilePath){
  var deferred = q.defer();

  originalFs.rename(oldFilepath, newFilePath, function(err){
    if(err) deferred.reject(err);
    else deferred.resolve(true);
  });

  return deferred.promise;
};

module.exports.doesFileExists = function(file){
  var deferred = q.defer();

  originalFs.access(file, function(err){
    if(err) deferred.reject(err);
    else deferred.resolve(true);
  });

  return deferred.promise;
};

module.exports.getAppAsarDirectoryPath = function(){
  var path = '';

  switch (module.exports.os()) {

    case 'osx':
      var app_name = 'API Garage.app';
      if( Config.name !== 'production' ) app_name = Config.name + '-' + app_name;
      path = os.homedir() + '/Applications/'+ app_name +'/Contents/Resources/';
      break;

    default:
      path = null;
      break;
  }

  return path;
};
