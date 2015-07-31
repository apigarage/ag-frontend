(function(){
  'use strict';
  var Datastore = require('nedb');
  var q = require('q');
  var app = require('app');
  var config = require('../../vendor/electron_boilerplate/env_config.js');

  var db_path = app.getPath('userData') + '/' + config.database_name;

  // without autload, nonthing would work.
  var db = new Datastore({filename: db_path, autoload: true});

  db.insertQ = function(doc){
    var deferred = q.defer();

    db.insert(doc, function(err, newDoc){
      if(err) deferred.reject(err);
      else deferred.resolve(newDoc);
    });

    return deferred.promise;
  };

  db.findQ = function(query){
    var deferred = q.defer();

    db.find(query, function(err, docs){
      if(err) deferred.reject(err);
      else deferred.resolve(docs);
    });

    return deferred.promise;
  };

  db.removeQ = function(query, options){
    var deferred = q.defer();

    db.remove(query, options, function(err, numberRemoved){
      if(err) deferred.reject(err);
      else deferred.resolve(numberRemoved);
    });

    return deferred.promise;
  };

  module.exports = db;

})();
