(function(){
  'use strict';
  /*global require: false */
  var app = require('app');
  // Make sure utils are initialized quite early to set online-offline status.
  require('./utils.js');
  var wm = require('./windowsManager.js');

  var mainWindow;

  app.on('ready', function () {
    var mainWindow = wm.createWindow();
    mainWindow.loadUrl("file://" + __dirname + "/app.html");
  });

  app.on('window-all-closed', function () {
    app.quit();
  });

  require('./background/start.js')();
})();
