(function(){

  'use strict';

  var Q = require('q');
  var os = require('os');
  var gulpUtil = require('gulp-util');
  var jetpack = require('fs-jetpack');
  var asar = require('asar');
  var utils = require('./utils');
  var argv = require('yargs').argv;

  var projectDir;
  var releasesDir;
  var tmpDir;
  var finalAppDir;
  var manifest;

  var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');

    // Get the latest version
    return utils.getRemoteManifest().then(function(remoteManifestJSON){
      // If version is provided in the command line, use that.
      if( argv.version ) manifest.version = argv.version;
      // Otherwise, get it from remote manifest file.
      else manifest.version = utils.getNextVersion(remoteManifestJSON.version, argv.bump);
      return utils.saveStringToFile(__dirname + '/../build/package.json', JSON.stringify(manifest));
    }).then(function(){
      // Update the app name according to the environment
      if( utils.getEnvName() == 'staging' ){
        manifest.name = 'staging-' + manifest.name;
        manifest.productName = 'staging-' + manifest.productName;
      }
      finalAppDir = tmpDir.cwd(manifest.productName + '.app');
    });

  };

  var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/electron-prebuilt/dist/Electron.app', finalAppDir.path());
  };

  var packageBuiltApp = function () {
    var deferred = Q.defer();

    asar.createPackage(projectDir.path('build'), finalAppDir.path('Contents/Resources/app.asar'), function() {
      deferred.resolve();
    });

    return deferred.promise;
  };

  var finalize = function () {
    // Prepare main Info.plist
    var info = projectDir.read('resources/osx/Info.plist');
    info = utils.replace(info, {
      productName: manifest.productName,
      identifier: manifest.identifier,
      version: manifest.version
    });
    finalAppDir.write('Contents/Info.plist', info);

    // Prepare Info.plist of Helper app
    info = projectDir.read('resources/osx/helper_app/Info.plist');
    info = utils.replace(info, {
      productName: manifest.productName,
      identifier: manifest.identifier
    });
    finalAppDir.write('Contents/Frameworks/Electron Helper.app/Contents/Info.plist', info);

    // Copy icon
    projectDir.copy('resources/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'));

    return Q(); // jshint ignore:line
  };

  var packToDmgFile = function () {
    var deferred = Q.defer();

    var appdmg = require('appdmg');
    var dmgName = manifest.name + '_' + manifest.version + '.dmg';
    var installationPath = os.homedir() + "/Applications";

    // Prepare appdmg config
    var dmgManifest = projectDir.read('resources/osx/appdmg.json');
    dmgManifest = utils.replace(dmgManifest, {
      productName: manifest.productName,
      installationPath: installationPath,
      appPath: finalAppDir.path(),
      dmgIcon: projectDir.path("resources/osx/dmg-icon.icns"),
      dmgBackground: projectDir.path("resources/osx/dmg-background.png")
    });
    tmpDir.write('appdmg.json', dmgManifest);

    // Delete DMG file with this name if already exists
    releasesDir.remove(dmgName);

    gulpUtil.log('Packaging to DMG file...');

    var readyDmgPath = releasesDir.path(dmgName);
    appdmg({
      source: tmpDir.path('appdmg.json'),
      target: readyDmgPath
    })
    .on('error', function (err) {
      console.error(err);
    })
    .on('finish', function () {
      gulpUtil.log('DMG file ready!', readyDmgPath);
      deferred.resolve();
    });

    return deferred.promise;
  };

  var cleanClutter = function () {
    return tmpDir.removeAsync('.');
  };

  module.exports = function () {
    return init()
    .then(copyRuntime)
    .then(packageBuiltApp)
    .then(finalize)
    .then(packToDmgFile)
    .then(cleanClutter);
  };

})();
