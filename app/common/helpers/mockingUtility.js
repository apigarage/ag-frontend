(function(){
  'use strict';
  var _ = require('lodash');

  var mockingUtility = {};

  // @endpoints: All Endpoints defined in the system
  // @request: All requests in the circle
  mockingUtility.match = function(endpoints, request){
    console.log(endpoints);
    console.log(request);

    var match = false;

    endpoints.forEach(function(endpoint, index, array){
      if(match) return;

      // TODO - Match Method (GET/POST/PUT)
      if(endpoint.method != request.method) return;

      // Matching patch
      if(endpoint.path != request.path) return;

      // TODO - Match Header
      // TODO - Match Body


      // If the request survives until this point, it is the match.
      match = {uuid : endpoint.uuid};
    });

    return match;
  };

  if(window){
    window.mockingUtility = mockingUtility;
  }

  return mockingUtility;
})();
