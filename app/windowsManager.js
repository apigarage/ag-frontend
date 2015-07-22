(function(){

  var BrowserWindow = require('browser-window');
  var env = require('./vendor/electron_boilerplate/env_config');
  var devHelper = require('./vendor/electron_boilerplate/dev_helper');
  var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
  var mainWindows = [];

  // Preserver of the window size and position between app launches.
  var mainWindowState = windowStateKeeper('main', {
    width: 1200,
    height: 800
  });

  module.exports.createWindow = function(params){
    if(!params){ // IF params are not provided, use default.
      params = {
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
      };
    }
    var w = new BrowserWindow(params);
    if(mainWindowState.isMaximized){
      w.maximize();
    }

    if (env.name === 'development') {
      devHelper.setDevMenu();
      w.openDevTools();
    }

    w.on('close', function () {
      mainWindowState.saveState(w);
    });

    mainWindows.push(w);
    return w;
  };

  module.exports.getAllWindows = function(){
    return mainWindows;
  };

  module.exports.sendToAllWindows = function(channel, args){
    mainWindows.forEach(function(w){
      w.send(channel, args);
    });
  };

})();
