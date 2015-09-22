// Loads config/env_XXX.json file and puts it
// in proper place for given Electron context.

(function () {
    'use strict';
    var jetpack = require('fs-jetpack');

    // For testing
    // Find the current filename, and compare it with 'spec.html' string.
    var fileName = __filename.substr(__filename.length - 9);
    if(fileName === 'spec.html'){
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
