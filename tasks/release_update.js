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

  var localPackageJSON = require('../package.json');

  var releaseForOs = {
    osx: require('./release_osx'),
    linux: require('./release_linux'),
    windows: require('./release_windows'),
  };

  function loadRemotePackageJSON(){
    return utils.getRemoteManifest();
  }

  /*
   * packageJSON = { .:., .:., version: _____,  .:. }
   * place = 'major' | 'minor' | 'feature'
   */
  function bumpVersion(currentVersion){
    var deferred = q.defer();

    // GET NEW VERSION
    var newVersion = utils.getNextVersion( currentVersion, argv.bump );

    // TODO - UPDATE build/package.json FILE WITH LATEST VERSION
    var buildPackageFileName = '../build/package.json';
    var localBuildPackageJSON = require(buildPackageFileName);
    localBuildPackageJSON.version = newVersion;
    fs.writeFile('build/package.json', JSON.stringify(localBuildPackageJSON), function (err) {
      if (err) deferred.reject(err);
      deferred.resolve(newVersion);
    });

    return deferred.promise;
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
  // gulp.task('release_update', function () {
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
      return bumpVersion(remoteManifestJSON.version);
    }).then(function(newVersion){

      newVersionNumber = newVersion;
      newFileName = 'app-' +  newVersionNumber + '.asar';

      console.log('New build filename is ', newFileName);
      // Convert "build folder" into app-[v.v.v].asar
      return buildAsar(newFileName);
    }).then(function(localFileLocation){
      var remoteFileLocation = env + '/updates/' + newFileName;

      console.log('uploading the file to', remoteFileLocation);
      // Upload the file to rackspace updates folder
      return uploadFileToRackspace('builds', remoteFileLocation, localFileLocation);
    }).then(function(){

      // Update the download url for the latest update asar file
      var latestVersionUrl = localPackageJSON.manifestServerURL + env + '/updates/' + newFileName;
      remoteManifestJSON.updates.linkToLatest = latestVersionUrl;

      // Update the version number
      remoteManifestJSON.version = newVersionNumber;

      // Upload the file to rackspace updates folder
      console.log('Uploading the remote manifest.json', remoteManifestJSON);
      var remoteFileLocation = env + '/manifest.json';
      return uploadStringToRackspace('builds', remoteFileLocation, JSON.stringify(remoteManifestJSON));
    });

  });

})();
