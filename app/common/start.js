(function(){
  var sync = require('./sync.js');

  module.exports = function(){
    console.log('Starting the background.js');
    sync();
  };
})();
