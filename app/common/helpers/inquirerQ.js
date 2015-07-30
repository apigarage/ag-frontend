(function(){

  /* THIS FILE IS NOT BEING USED AT THE MOMENT.
  BUT IT WILL BE USED AGAIN, WHEN WE START FOCUSING
  ON THE CLI TOOL AGAIN */

  'use strict';
  var q = require('q');
  var inquirer = require('inquirer');

  inquirer.promptQ = function(params, collback){
    var deferred = q.defer();
    inquirer.prompt(params, function(results){
      deferred.resolve(results);
    });

    return deferred.promise;
  };

  module.exports = inquirer;
})();
