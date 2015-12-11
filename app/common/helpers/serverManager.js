(function(){
  var serverList = [];
  var _ = require('lodash');
  var http = require('http');
  var URI = require('urijs');
  var request = require('./request.js');
  var windowsManager  = require('./windowsManager.js');
  var config = require('../../vendor/electron_boilerplate/env_config.js');
  var Q = require('q');

  // Maintain a hash of all connected sockets
  var sockets = {}, nextSocketId = 0;
  var server = {};

  var responses = [];
  module.exports.createServer = function(options){
    //console.log("start", options.port);
    server = http.createServer(function (serverRequest, serverResponse) {

      var mockedResponse = {
        statusCode : serverRequest.headers['x-ag-expected-status']
      };


      var pathMatched = match(serverRequest);

      if(pathMatched){
        // Read Status Code
        if( ! mockedResponse.statusCode ) mockedResponse.statusCode = 200; // defautls to 200.

        // Check if any response for this endpoint exist
        if(pathMatched.endpoint && responses[pathMatched.endpoint.uuid]){
          // Check if response for this endpoint and status code exist
          if( responses[pathMatched.endpoint.uuid][mockedResponse.statusCode] ){
            mockedResponse.body = responses[pathMatched.endpoint.uuid][mockedResponse.statusCode].data;
            // Find and replace url string variables with body variables.
            Object.keys(pathMatched.variables).forEach(function(key){
              // TODO: Accomodate for environment variables with spaces in the endpoint
              // matches one or more spaces before and after the key
              // var matchedKey = new RegExp("{{ *" + key + " *}}");

              // matches key inbetween curly braces
              mockedResponse.body = mockedResponse.body.replace('{{' + key + '}}', pathMatched.variables[key]);
            });
          } else {
            // Please write a better copy.
            mockedResponse.body = 'Yes, endpoint is correct, we could not find the '+
              'response code you are looking for. Please set one up, and try again.';
            mockedResponse.statusCode = 217;
          }

        } else {
          // Please write a better copy.
          mockedResponse.body = 'Oops, there are no responses set for this endpoint.'+
            ' Please set one up, and try again.';
          mockedResponse.statusCode = 217;
        }
      }
      else {
        mockedResponse.statusCode = 404;
        mockedResponse.body = 'URL definition not found.';
      }

      var mockingLog = {};

      // if method is a GET just make the log with no data
      // else
      // serverRequest.on('end')

      // This doesn't work
      // serverResponse.writeHead(mockedResponse.statusCode, {});
      // serverResponse.end(mockedResponse.body + '\n');
      // Need to figure out which request methods require data
      // serverRequest.on('end', function(serverRequestData) {
      //   console.log("Received body data:", serverRequestData);
      //   mockingLog = buildMockingLog(serverRequest, serverResponse, foundResponse,
      //     mockedResponse, serverRequestData);
      //     windowsManager.sendToAllWindows('ag-message', mockingLog);
      // });

      // This doesn't work
      // if(serverRequest.method=="GET"){
      //   mockingLog = buildMockingLog(serverRequest, serverResponse, foundResponse,
      //     mockedResponse);
      //   windowsManager.sendToAllWindows('ag-message', mockingLog);
      // }else{
      //   serverRequest.on('end', function(serverRequestData) {
      //     console.log("Received body data:", serverRequestData);
      //     mockingLog = buildMockingLog(serverRequest, serverResponse, foundResponse,
      //       mockedResponse, serverRequestData);
      //       windowsManager.sendToAllWindows('ag-message', mockingLog);
      //   });
      // }

      // This works
      if(serverRequest.method=="GET"){
        mockingLog = buildMockingLog(serverRequest, serverResponse, pathMatched,
          mockedResponse);
        windowsManager.sendToAllWindows('ag-message', mockingLog);
      }else{
        serverRequest.on('data', function(serverRequestData) {
          mockingLog = buildMockingLog(serverRequest, serverResponse, pathMatched,
            mockedResponse, serverRequestData);
            windowsManager.sendToAllWindows('ag-message', mockingLog);
        });
      }

    }).listen(options.port, function (err) {
      // console.log('listening http://localhost:'+ options.port +'/');
      // console.log('pid is ' + process.pid);
    });

    server.on('connection', function (socket) {
      // Add a newly connected socket
      var socketId = nextSocketId++;
      sockets[socketId] = socket;
      // console.log('socket', socketId, 'opened');

      // Remove the socket when it closes
      socket.on('close', function () {
        // console.log('socket', socketId, 'closed');
        delete sockets[socketId];
      });
    });

    return setResponses(options)
      .then(function(){
        // Why are we returning option paths back to the renderer?
        return setPaths(options.endpoints, options);
      });

  };

  function buildMockingLog(serverRequest, serverResponse, pathMatched,
    mockedResponse, serverRequestData){

    // Possible issue with dealing with non-string data
    var mockingLog = {
      eventName : 'update-mocking-logs',
      request: {
        'url': serverRequest.url,
        'headers': serverRequest.headers,
        'method': serverRequest.method,
        'data': serverRequestData ? serverRequestData.toString() : ""
      },
      response: {
        // 'headers': {},
        'data': mockedResponse.body,
        'status': mockedResponse.statusCode
      },
      endpoint: pathMatched ? pathMatched.endpoint : {}
    };

    serverResponse.writeHead(mockedResponse.statusCode, {});
    serverResponse.end(mockedResponse.body + '\n');

    return mockingLog;
  }

  function replaceVariables(responseBody, variables){
    variables.forEach(function(variable){
      // console.log('replacing variable', variable);
      // responseBody.replace('{{'+ variable.key +'}}', variable.value);
    });
  }

  function match(request){
    var found = null;

    // console.log('Request ', request.url , '---', request.method);

    server.paths.forEach(function(path, index, array){

      if(found) return;

      // Match Method (GET/POST/PUT/DELETE/PATCH)
      if(path.endpoint.method != request.method) return;

      // Match the path
      path.regexp.lastIndex = 0; // resetting the last regex.
      found = path.regexp.exec(request.url);
      // If path and method both matches, return the path.
      if(found) {
        // console.log('Matched');
        // If the request survives until this point, it is the match.
        found.endpoint = path.endpoint;
        // Get the matched variable values from the URL.
        found.variables = {};
        var i = 0;
        path.variables.forEach(function(variable){
          found.variables[variable] = found[++i]; // ++i because the first element if the full regex match.
        });
      }

    });

    return found;
  }

  /*
   * access_token
   */
  function setResponses(options){
    var requestOptions = {
      'method': 'GET',
      'url': config.url + '/api/projects/' + options.projectId + '/responses',
      'headers':{
        "Content-Type": "application/json",
        'Authorization': options.accessToken
      }
    };

    return request.send(requestOptions)
      .then(function(response){
        _.forEach(response.body, function(response){
          if(! responses[response['item.uuid']] ) responses[response['item.uuid']] = [];
          responses[response['item.uuid']][response.status] = response;
        });
      });
  }

  function setPaths(endpoints, options){
    var paths = [];
    _.forEach(endpoints, function(collection){
      // console.log('Collection', collection);
      _.forEach(collection.items, function(endpoint){
        endpoint.parsedUrl = URI.parse(endpoint.url);

        // If hostname is not defined, nothing to mock here.
        if( ! endpoint.parsedUrl.hostname ) return;

        endpoint.pathWithQuery = endpoint.parsedUrl.query
          ? endpoint.parsedUrl.path + '\\?' + endpoint.parsedUrl.query // <-- double escape is required.
          : endpoint.parsedUrl.path;

        // Extracting Variables Keys out of Path for later usage
        var variables = endpoint.pathWithQuery.match(/{{.*}}/gi);
        variables = _.map(variables, function(variable){
          return variable.substring(2, variable.length-2); // removeing '{{' & '}}'
        });

        // Replacing {{ }} with regex for later matches
        endpoint.pathWithQuery = endpoint.pathWithQuery.replace(/{{.*}}/, '([a-zA-Z0-9\-]*)'); // Regex is to match with ( any alphanumeric keywords + dash )
        endpoint.pathWithQuery = '^\/*' + endpoint.pathWithQuery + '\/*$'; // Optional Slashes in the beggining and at the end.
        var regexp = new RegExp(endpoint.pathWithQuery, 'gi');

        paths.push({
          variables: variables,
          regexp: regexp,
          endpoint: endpoint
        });
      });
    }, []);

    // console.log('GOING TO SET PATHS FROM THESE ENDPOINTS', endpoints);
    server.paths = paths;
    // console.log('All Paths', paths);

    // Make sure return relevant render side data
    return { "eventName": options.eventName, "port": options.port };
  }

  module.exports.stopServer = function(){
    // console.log("stop");
    for (var socketId in sockets) {
      console.log('socket', socketId, 'destroyed');
      console.log('socket', sockets[socketId]);
      sockets[socketId].destroy();
    }
    server.close();
    delete server.paths;
  };


})();
