(function(){
  'use strict';
  var wm = require('../common/helpers/windowsManager.js');
  var app = require('app');
  var env = require('../vendor/electron_boilerplate/env_config');
  var Menu = require('menu');
  var MenuItem = require('menu-item');


  module.exports.init = function(){

    app.on('ready', function () {
      var mainWindow = wm.createWindow({
        'width': 1000,
        'height': 800,
        'min-width': 600,
        'min-height': 640
      });
      mainWindow.loadUrl("file://" + __dirname + "/index.html");
      
      var template = [{
        label: 'API Garage',
        submenu: [
          {
            label: 'Hide API Garage',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          },
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:'
          },
          {
            label: 'Close',
            accelerator: 'Command+W',
            selector: 'performClose:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Bring All to Front',
            selector: 'arrangeInFront:'
          },
        ]
      },
      {
        label: 'Help',
        submenu: []
      }];


      if (env.name === 'development') {
        template.push({
          label: 'View',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'Command+R',
              click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
            },
            {
              label: 'Toggle DevTools',
              accelerator: 'Alt+Command+I',
              click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
            },
          ]
        });
      }

      var menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    });

    app.on('window-all-closed', function () {
      app.quit();
    });

    require('../common/start.js')();
  };
})();
