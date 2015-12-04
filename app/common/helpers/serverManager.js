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
    console.log("start", options.port);
    server = http.createServer(function (req, res) {

      var response = {
        statusCode : req.headers['x-ag-expected-status']
      };
      var found = match(req);
      if(found){

        // Read Status Code
        if( ! response.statusCode ) response.statusCode = 200; // defautls to 200.

        // Check if any response for this endpoint exist
        if(found.endpoint && responses[found.endpoint.uuid]){
          // Check if response for this endpoint and status code exist
          if( responses[found.endpoint.uuid][response.statusCode] ){
            // TODO : Replace variables in the response with the given variables
            response.body = responses[found.endpoint.uuid][response.statusCode].data;
          } else {
            // Please write a better copy.
            response.body = 'Yes, endpoint is correct, we could not find the '+
              'response code you are looking for. Please set one up, and try again.';
            response.statusCode = 217;
          }
        } else {
          // Please write a better copy.
          response.body = 'Oops, there are no responses set for this endpoint.'+
            ' Please set one up, and try again.';
          response.statusCode = 217;
        }
      }
      else {
        response.statusCode = 404;
        response.body = 'URL definition not found.';
      }

      res.writeHead(response.statusCode, {});
      res.end(response.body + '\n');

      req.eventName = 'updateMockingLogs';
      res.eventName = 'updateMockingLogs';
      windowsManager.sendToAllWindows('ag-message', req);
      windowsManager.sendToAllWindows('ag-message', res);

    }).listen(options.port, function (err) {
      console.log('listening http://localhost:'+ options.port +'/');
      console.log('pid is ' + process.pid);
    });

    server.on('connection', function (socket) {
      // Add a newly connected socket
      var socketId = nextSocketId++;
      sockets[socketId] = socket;
      console.log('socket', socketId, 'opened');

      // Remove the socket when it closes
      socket.on('close', function () {
        console.log('socket', socketId, 'closed');
        delete sockets[socketId];
      });
    });

    return setResponses(options)
      .then(function(){

        // Why are we returning option paths back to the renderer?
        return setPaths(options.endpoints, options);
      });

  };

  function replaceVariables(responseBody, variables){
    variables.forEach(function(variable){
      console.log('replacing variable', variable);
      // responseBody.replace('{{'+ variable.key +'}}', variable.value);
    });
  }

  function match(request){
    var found = null;

    console.log('Request ', request.url , '---', request.method);

    server.paths.forEach(function(path, index, array){

      if(found) return;

      // Match Method (GET/POST/PUT/DELETE/PATCH)
      if(path.endpoint.method != request.method) return;

      // Match the path
      path.regexp.lastIndex = 0; // resetting the last regex.
      found = path.regexp.exec(request.url);

      // If path and method both matches, return the path.
      if(found) {
        console.log('Matched');
        // If the request survives until this point, it is the match.
        found.endpoint = path.endpoint;

        // Get the matched variable values from the URL.
        found.variables = {};
        var i = 0;
        path.variables.forEach(function(variable){
          found.variables[variable] = found[++i]; // ++i because the first element if the full regex match.
        });
        found.variables = path.variables;
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
    console.log("stop");
    for (var socketId in sockets) {
      console.log('socket', socketId, 'destroyed');
      console.log('socket', sockets[socketId]);
      sockets[socketId].destroy();
    }
    server.close();
    delete server.paths;
  };


})();
