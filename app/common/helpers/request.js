(function(){
  'use strict';
  var unirest = require('unirest');
  var q = require('q');
  var config = require('../../vendor/electron_boilerplate/env_config');

  module.exports.send = function(options){
    var deferred = q.defer();
    unirest.get(config.url)
      .end(function(response){
        deferred.resolve(response);
      });
    return deferred.promise;
  };

})();
