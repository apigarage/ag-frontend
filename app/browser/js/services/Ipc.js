angular.module('app')
.factory('ipc', [function(){
  var ipc = require('ipc');
  return function() {
    return ipc;
  };
}]);
