(function(){
  'use strict';
  // logs in the user.
  // add the token to the local storage
  module.exports.login = function(event, args){
    var username = args.username;
    var password = args.parssword;
    
  };

  ipc.on('ag-login', login);

})();
