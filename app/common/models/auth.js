(function(){
  'use strict';
  var app = require('app');
  var q = require('q');
  var request = require('../helpers/request.js');
  var inquirer = require('../helpers/inquirerQ.js');
  var querystring = require('querystring');
  var db = require('../helpers/db.js');
  var config = require('../../vendor/electron_boilerplate/env_config.js');

  var accessTokenId = 'access-token';
  function insertAccessTokenToDB(accessToken){
    var accessTokenDoc = {
      _id : accessTokenId,
      value: accessToken
    };
    return db.insertQ(accessTokenDoc);
  }

  function readAccessTokenFromDB(){
    var accessTokenQuery = {
      _id : accessTokenId
    };
    return db.findQ(accessTokenQuery);
  }

  module.exports.getAccessToken = function(){
    return readAccessTokenFromDB()
      .then(function(accessTokenDocs){
        //console.log('READING FROM DB' + JSON.stringify(accessTokenDocs));
        if(accessTokenDocs.length !== 1) return null;
        return accessTokenDocs[0].value;
      });
  };

  // logs in the user.
  // add the token to the local database.
  module.exports.login = function(credentials){
    credentials = {
      email: 'chinmay@chinmay.ca',
      password: 'password'
    };

    var data = {
      "username": credentials.email,
      "password": credentials.password,
      "client_id": config.client_id,
      "client_secret": config.client_secret,
      "grant_type": "password"
    };
    data = querystring.stringify(data);
    var options = {
      'method': 'POST',
      'url': config.url + 'oauth/token' ,
      'headers':{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      'data': data
    };

    return request.send(options)
      .then(function(res){
        // Assuming that login worked.
        // TODO - VALIDATION and ERROR HANDLING.
        //console.log(res.raw_body);
        //console.log('about to parse');
        var accessToken = JSON.parse(res.raw_body);
        //console.log('just parsed you');
        //console.log(accessToken);
        return insertAccessTokenToDB(accessToken.access_token);
      })
      .then(function(newDoc){
        //console.log(newDoc);
        return newDoc.value;
      })
      .catch(function(err){
        //console.log(err);
      });
  };

  function removeAccessTokenFromDB(){
    var accessTokenQuery = {
      _id : accessTokenId
    };
    return db.removeQ(accessTokenQuery, {});
  }

  module.exports.logout = function(){
    return removeAccessTokenFromDB();
  };

  // Unused. will be used again when cli tool is developed.
  // module.exports.login = function(credentials){
  //
  //   if(credentials){
  //     return request.send({})
  //       .then(function(response){
  //         // //console.log(response);
  //       })
  //       .then(function(){
  //         // //console.log(response);
  //         app.quit();
  //       })
  //       .catch(function(err){
  //         //console.log('errrr');
  //         //console.log(err);
  //       });
  //   }
  //   else{
  //     getLoginCredentials();
  //   }
  // };
  //
  // function getLoginCredentials(){
  //   var promptSchema = [{
  //     name: 'email',
  //     message: 'Email',
  //     type: 'input'
  //   },{
  //     name: 'password',
  //     message: 'Password',
  //     type: 'password'
  //   }];
  //
  //   return inquirer.prompt(promptSchema, function(credentials){
  //     serverLogin(credentials);
  //   });
  // }

})();
