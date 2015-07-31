(function(){
  'use strict';
  var auth = require('../common/models/auth.js');
  var app = require('app');
  var args = require('yargs').argv;

  module.exports.init = function(){

    // TODO - Use Commander Later On
    // https://www.npmjs.com/package/commander
    if(args._[0] == 'logout'){
      return auth.logout()
        .then(function(){
            console.log('LOGGED OUT');
            app.quit();
        });
    }

    // CHECK IF THE USER IS LOGGED IN OR NOT.
    // IF NOT LOGGED IN, ASK FOR LOGIN.
    auth.getAccessToken()
      .then(function(accessToken){
        console.log('ACCESS TOKEN FROM THE DB READ - ' + accessToken);
        if(! accessToken ){
          return auth.login();
        } else {
          return accessToken;
        }
      })
      .then(function(accessToken){
        console.log('YOU SHOULD HAVE AN ACCESS TOKEN BY NOW');
        console.log(accessToken);
      })
      .then(function(){
        app.quit();
      });
  };
})();
