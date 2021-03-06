(function(){

  'use strict';

  var app = require('app');
  var BrowserWindow = require('browser-window');
  var devHelper = require('../app/vendor/electron_boilerplate/dev_helper');
  var windowStateKeeper = require('../app/vendor/electron_boilerplate/window_state');

  var wm = require('../app/common/helpers/windowsManager.js');
  var serverManager = require('../app/common/helpers/serverManager.js');
  var ipc = require('ipc');

  var mainWindow;

  // Preserver of the window size and position between app launches.
  var mainWindowState = windowStateKeeper('main', {
    width: 1600,
    height: 1200
  });

  ipc.on('start-server', function(event, server) {
    console.log("START",server);
    event.returnValue = 'start';

    serverManager.createServer(server.port);
    wm.sendToAllWindows('start-server', { 'port': server.port });
  });

  ipc.on('stop-server', function(event, arg) {
    console.log("STOP",arg);
    event.returnValue = 'stop';
    serverManager.stopServer();
    wm.sendToAllWindows('stop-server', { 'port': 9090 });
  });

  app.on('ready', function () {

    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height
    });
    mainWindow.loadUrl('file://' + __dirname + '/spec.html');

    devHelper.setDevMenu();
    mainWindow.openDevTools();

    mainWindow.on('close', function () {
      mainWindowState.saveState(mainWindow);
    });
  });

  app.on('window-all-closed', function () {
    app.quit();
  });

})();
