(function(){
  'use strict';
  var app = require('app');
  var q = require('q');
  var request = require('../helpers/request.js');
  var inquirer = require('../helpers/inquirerQ.js');
  var config = require('../../vendor/electron_boilerplate/env_config.js');
  // logs in the user.
  // add the token to the local database.

  module.exports.login = function(){
    return request.send({})
      .then(function(res){
        console.log(res.body);
        app.quit();
      })
      .catch(function(err){
        console.log(err);
      });
  };

  // module.exports.login = function(credentials){
  //
  //   if(credentials){
  //     return request.send({})
  //       .then(function(response){
  //         // console.log(response);
  //       })
  //       .then(function(){
  //         // console.log(response);
  //         app.quit();
  //       })
  //       .catch(function(err){
  //         console.log('errrr');
  //         console.log(err);
  //       });
  //   }
  //   else{
  //     getLoginCredentials();
  //   }
  // };
  //
  function getLoginCredentials(){
    var promptSchema = [{
      name: 'email',
      message: 'Email',
      type: 'input'
    },{
      name: 'password',
      message: 'Password',
      type: 'password'
    }];

    return inquirer.prompt(promptSchema, function(credentials){
      serverLogin(credentials);
    });
  }

})();
