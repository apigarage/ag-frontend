(function(){
  'use strict';
  var wm = require('../common/helpers/windowsManager.js');
  var app = require('app');

  module.exports.init = function(){

    app.on('ready', function () {
      var mainWindow = wm.createWindow({
        'width': 1000,
        'height': 800,
        'min-width': 600,
        'min-height': 640,
        'node-integration':false
      });
      mainWindow.loadUrl("file://" + __dirname + "/index.html");
    });

    app.on('window-all-closed', function () {
      app.quit();
    });

    require('../common/start.js')();
  };
})();
