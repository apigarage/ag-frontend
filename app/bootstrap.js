(function(){

  'use strict';

  /*global require: false */
  var app = require('app');
  var args = require('yargs').argv;

  app.commandLine.appendSwitch ('ignore-certificate-errors', 'true');

  if(args._.length > 0){
    var cli = require('./cli/main.js');
    cli.init();
  }
  else{
    var browser = require('./browser/main.js');
    browser.init();
  }


})();
