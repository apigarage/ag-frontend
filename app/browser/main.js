(function(){
  'use strict';
  var wm = require('../common/helpers/windowsManager.js');
  var app = require('app');

  module.exports.init = function(){

    app.on('ready', function () {
      var mainWindow = wm.createWindow();
      mainWindow.loadUrl("file://" + __dirname + "/index.html");
    });

    app.on('window-all-closed', function () {
      app.quit();
    });

    require('../common/start.js')();
  };
})();
