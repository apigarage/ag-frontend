(function(){
  'use strict';
  var app = require('app');
  var originalFs = require('original-fs');
  var Menu = require('menu');
  var MenuItem = require('menu-item');
  var BrowserWindow = require('browser-window');

  var env = require('../vendor/electron_boilerplate/env_config');
  var wm = require('../common/helpers/windowsManager.js');
  var utils = require('../vendor/app_utils.js');
  var ipc = require('ipc');
  var serverManager = require('../common/helpers/serverManager.js');

  module.exports.init = function(){
    ipc.on('start-server', function(event, server) {
      console.log("START",server);
      serverManager.createServer(server);
      wm.sendToAllWindows('start-server', { 'port': server.port });
      event.returnValue = 'start';
    });
    ipc.on('stop-server', function(event, arg) {
      console.log("STOP", arg);
      serverManager.stopServer();
      wm.sendToAllWindows('stop-server', {});
      event.returnValue = 'stop';
    });

    app.on('ready', function () {

      var mainWindow = wm.createWindow({
        'width': 1000,
        'height': 800,
        'min-width': 600,
        'min-height': 640
      });
      mainWindow.loadUrl("file://" + __dirname + "/index.html");

      var template = [];
      if(utils.os() === 'osx'){
        template.push({
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
              accelerator: 'CmdOrCtrl+Z',
              selector: 'undo:'
            },
            {
              label: 'Redo',
              accelerator: 'Shift+CmdOrCtrl+Z',
              selector: 'redo:'
            },
            {
              type: 'separator'
            },
            {
              label: 'Cut',
              accelerator: 'CmdOrCtrl+X',
              selector: 'cut:'
            },
            {
              label: 'Copy',
              accelerator: 'CmdOrCtrl+C',
              selector: 'copy:'
            },
            {
              label: 'Paste',
              accelerator: 'CmdOrCtrl+V',
              selector: 'paste:'
            },
            {
              label: 'Select All',
              accelerator: 'CmdOrCtrl+A',
              selector: 'selectAll:'
            },
          ]
        },
        {
          label: 'Window',
          submenu: [
            {
              label: 'Minimize',
              accelerator: 'CmdOrCtrl+M',
              selector: 'performMiniaturize:'
            },
            {
              label: 'Close',
              accelerator: 'CmdOrCtrl+W',
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
        });

        if (env.name === 'staging' || env.name === 'development') {
          template.push({
            label: 'View',
            submenu: [
              {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
              },
              {
                label: 'Toggle DevTools',
                accelerator: 'Alt+CmdOrCtrl+I',
                click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
              },
            ]
          });
        }

      }


      template.push({
        label: 'About',
        submenu: [
          {
            label: 'Version',
            click: function() {
              var aboutWindowParams = {
                'width': 370,
                'height': 320,
                'title': 'About',
                'auto-hide-menu-bar': true,
                'resizable': false
              };
              var aboutWindow = new BrowserWindow(aboutWindowParams);
              aboutWindow.loadUrl("file://" + __dirname + "/about.html");
            }
          }
        ]
      });

      var menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);

      // Analytics Session Management Start
      var sessionTimer;
      var timeout;
      var sessionOver = false;

      if (env.name === 'production') {
        timeout = 1000 * 60 * 30;
      }else{
        timeout = 5000;
      }

      mainWindow.on('blur', function(){
        sessionTimer = setTimeout(function(){
          sessionOver = true;
        }, timeout);
      });

      mainWindow.on('focus', function(){
        clearTimeout(sessionTimer);
        if(sessionOver) {
          wm.sendToAllWindows('start-session');
          sessionOver = false;
        }
      });

      // Analytics Session Management End
    });

    app.on('window-all-closed', function () {
      if(utils.os() === 'osx'){
        var asarFileDirectoryPath = utils.getAppAsarDirectoryPath();
        var updatePath = asarFileDirectoryPath + '/app.update';

        // Step 1: Check if apigarage.update is available in the Resources folder
        return utils.doesFileExists(updatePath)
          .then(function(){
            // Step 2: Rename apigarage.update to app.asar
            return utils.renameFile(updatePath, asarFileDirectoryPath + '/app.asar');
          })
          .catch(function(err){
            console.log(err);
          })
          .finally(function(){
            app.quit();
          });
      } else {
        app.quit();
      }
    });

    require('../common/start.js')();
  };

})();
