(function(){

  'use strict';

  var gulp = require('gulp');
  var q = require('q');
  var asar = require('asar');
  var fs = require('fs');
  var semver = require('semver');
  var pkgcloud = require('pkgcloud');
  var argv = require('yargs').argv;
  var stream = require('stream');

  var utils = require('./utils');

  var request = require('../app/common/helpers/request.js');
  var localPackageJSON = require('../package.json');
  var localBuildPackageJSON = require('../build/package.json');

  var releaseForOs = {
    osx: require('./release_osx'),
    linux: require('./release_linux'),
    windows: require('./release_windows'),
  };

  function loadRemotePackageJSON(){
    var remoteUrl = null;
    remoteUrl = localPackageJSON.manifestFileUrl;

    if(!remoteUrl) {
      // console.log('remote package.json URL is not provided');
      process.abort();
    }

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
  }

  /*
   * packageJSON = { .:., .:., version: _____,  .:. }
   * place = 'major' | 'minor' | 'feature'
   */
  function bumpVersion(packageJSON){
    var currentVersion = packageJSON.version;
    console.log('Current Version IS ', currentVersion);
    var bump = argv.bump ? argv.bump : 'patch'; // major, minor, patch
    var newVersion = semver.inc(currentVersion, bump);
    console.log('New Version IS ', newVersion);
    packageJSON.version = newVersion;
    return packageJSON;
  }

  /*
   * versionNumber = [major.minor.feature]
   */
  function buildAsar(newFileName){
    var deferred = q.defer();

    var asarFilePath = 'releases/updates/' + newFileName;

    asar.createPackage('build', asarFilePath, function() {
      deferred.resolve(asarFilePath);
    });

    return deferred.promise;
  }

  /*
   * Rackspace Upload : Start
   */
  function getRackspaceClient(){
    return pkgcloud.storage.createClient({
      provider: 'rackspace',
      username: 'apigarage',
      apiKey: '62dcbefe333d4c1cbf77111dbc25ec9c',
      region: 'IAD'
    });
  }


  function getWritableStream(client, container, remoteFileLocation, deferred){
    // create a writeable stream for our destination
    var dest = client.upload({
      container: container,
      remote: remoteFileLocation
    });

    dest.on('error', function(err) {
      console.log('We were not able to upload', err);
      deferred.reject(err);
    });

    dest.on('success', function(file) {
      console.log('File is uploaded');
      deferred.resolve(file);
    });

    return dest;
  }

  function uploadFileToRackspace(container, remoteFileLocation, localFileLocation){

    var deferred = q.defer();

    var client = getRackspaceClient();
    var dest = getWritableStream(client, container, remoteFileLocation, deferred);

    // pipe the source to the destination
    var source = fs.createReadStream(localFileLocation);
    source.pipe(dest);

    return deferred.promise;
  }

  function uploadStringToRackspace(container, remoteFileLocation, uploadString){
    var deferred = q.defer();

    // each client is bound to a specific service and provider
    var client = getRackspaceClient();
    var dest = getWritableStream(client, container, remoteFileLocation, deferred);

    // pipe the source to the destination
    var source = new stream.Readable();
    source._read = function noop() {}; // redundant? see update below
    source.push(uploadString);
    source.push(null);

    source.pipe(dest);

    return deferred.promise;
  }
  /*
   * Rackspace Upload : End
   */

  gulp.task('release_update', ['build'], function () {
    var remoteManifestJSON = null;
    var newVersionNumber = null;
    var newFileName = null;
    var env = argv.env;

    if( !env ){
      console.log('env is missing');
      process.exit();
    }

    if( env == 'production' ){
      console.log('DEPLOYING TO PRODUCTION .....  ');
      // ASK SOME SORT OF VALIDATION FOR DEPLOYING TO RPDOUCTION
    }

    // Download the latest version from rackspace package.json
    return loadRemotePackageJSON().then(function(remoteData){
      remoteManifestJSON = remoteData;

      // console.log('remoteManifestJSON', remoteManifestJSON);
      // bump-up-the-version (major release, minor release, features/bugs)
      return bumpVersion(remoteManifestJSON);
    }).then(function(updatedManifestJSON){

      remoteManifestJSON = updatedManifestJSON;
      newVersionNumber = remoteManifestJSON.version;

      newFileName = 'app-' +  newVersionNumber + '.asar';

      // Convert "build folder" into app-[v.v.v].asar
      return buildAsar(newFileName);
    }).then(function(localFileLocation){
      var remoteFileLocation = env + '/updates/' + newFileName;

      // Upload the file to rackspace updates folder
      return uploadFileToRackspace('builds', remoteFileLocation, localFileLocation);
    }).then(function(){
      if(env == 'production'){
        var remoteFileLocation = 'manifest.json';
        // console.log('Updating Production Manifest ', JSON.stringify(remoteManifestJSON));
        // Upload the file to rackspace updates folder
        return uploadStringToRackspace('builds', remoteFileLocation, JSON.stringify(remoteManifestJSON));
      }
    });

    // 5. Update the remote package file
  });

})();
