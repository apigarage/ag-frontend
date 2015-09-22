'use strict';

angular.module('app')
  .factory('UUID', [function(){
    // Source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript?page=1&tab=votes#tab-top
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }

    function generate(){
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

    return {
      generate: generate
    };
  }]);
