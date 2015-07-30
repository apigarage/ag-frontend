(function(){
  'use strict';
  var auth = require('../common/models/auth.js');

  module.exports.init = function(){
    auth.login();
  };
})();
