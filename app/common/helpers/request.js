(function(){
  'use strict';
  var unirest = require('unirest');
  var q = require('q');
  var config = require('../../vendor/electron_boilerplate/env_config');

/*
Examples of options:
{
  method: 'GET' // GET, POST, PUT, PATCH, HEAD, DELETE (case insensitive)
  url: 'http://localhost.com:8000?x=7&y=9'
  headers: {'Accept': 'application/json', 'key1': 'value1'}
  body: 'HAS TO BE A STRING'
}
*/
  module.exports.send = function(options){
    var deferred = q.defer();

    var request = setOptions(options);
    request.complete(function(response){
      deferred.resolve(response);
    });
    return deferred.promise;
  };

  function setOptions(options){
    var method = options.method.toLowerCase();
    return unirest(method, options.url, options.headers, options.data);
  }

})();
