(function(){
  'use strict';
  var _ = require('lodash');
  var crossroads = require('crossroads');

  var mockingUtility = {};
  mockingUtility.matchedArguments = false; // ONLY FOR TESTING.

  mockingUtility.init = function(endpoints){
    // SETUP ENdpoint Regular Expressions
  };

  // @endpoints: All Endpoints defined in the system
  // @request: All requests in the circle

  if(window){
    window.mockingUtility = mockingUtility;
  }

  return mockingUtility;
})();
