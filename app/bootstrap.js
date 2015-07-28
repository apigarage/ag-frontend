(function(){

  'use strict';

  /*global require: false */
  var app = require('app');
  var args = require('yargs').argv;

  if(args._.length > 0){
    var cli = require('./cli/main.js');
    cli.init();
  }
  else{
    var browser = require('./browser/main.js');
    browser.init();
  }


})();
