(function(){

  'use strict';

  var argv = require('yargs').argv;
  var os = require('os');
  var q = require('q');
  var fs = require('fs');
  var jetpack = require('fs-jetpack');
  var semver = require('semver');
  var localPackageJSON = require('../package.json');
  var request = require('../app/common/helpers/request.js');

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

  module.exports.replace = function (str, patterns) {
    Object.keys(patterns).forEach(function (pattern) {
      var matcher = new RegExp('{{' + pattern + '}}', 'g');
      str = str.replace(matcher, patterns[pattern]);
    });
    return str;
  };

  module.exports.getEnvName = function () {
    return argv.env || 'development';
  };

  module.exports.getRemoteManifest = function(){
    var remoteUrl = localPackageJSON.manifestServerURL + '/' + argv.env + localPackageJSON.manifestFileUrl;
    if(!remoteUrl) { process.abort(); }

    var options = {
      url: remoteUrl,
      method: 'get'
    };

    return request.send(options)
      .then(function(response){
        return JSON.parse(response.raw_body);
      })
      .catch(function(err){
        console.log('unable to retrieve remote package file.');
        console.log(err);
        process.abort();
      });
  };

  module.exports.getNextVersion = function(currentVersion, bump){
    console.log('Current Version is', currentVersion);
    var newVersion = semver.inc(currentVersion, bump);
    console.log('New Version is', newVersion);
    if(!newVersion) {
      console.log('Cannot build the new version.');
      process.abort();
    }
    return newVersion;
  };

  module.exports.saveStringToFile = function(file, data){
    var deferred = q.defer();
    fs.writeFile(file, data, function (err) {

      if (err) return q.reject(err);
      return q.resolve(true);
    });
    return q.promise;
  };

  module.exports.getElectronVersion = function () {
    var manifest = jetpack.read(__dirname + '/../package.json', 'json');
    return manifest.devDependencies['electron-prebuilt'].substring(1);
  };

})();
