// Loads config/env_XXX.json file and puts it
// in proper place for given Electron context.

(function () {
    'use strict';
    var jetpack = require('fs-jetpack');

    // For testing
    // Find the current directory from dirname, and compare it with 'tests'.
    // __dirname returns the full path of the directory.
    var dirnames = __dirname.split('/');
    if(dirnames[dirnames.length-1] === 'tests'){
      window.env = jetpack.read(__dirname + '/../build/env_config.json', 'json');
      return;
    }

    // For everything except testing.
    if (typeof window === 'object') {
        // Web browser context, __dirname points to folder where app.html file is.
        window.env = jetpack.read(__dirname + '/../env_config.json', 'json');
    } else {
        // Node context
        module.exports = jetpack.read(__dirname + '/../../env_config.json', 'json');
    }
}());
