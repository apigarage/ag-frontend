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
      // unclear why it is sending twice
      // request headers always has response
      // we query the response and return it as is.
      // we would need a localStorage for all the response
      // need to define what makes a unique request
      // figure out where in the file system it is creating the server

      var found = match(req);
      if(found){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(found) + '\n');
        // TODO - Find the response code.
        // TODO - Fetch response
        // TODO - Response back
        // TODO - Log the response
      }
      else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('URL not found\n');
        // TODO - Ask user to enter the mocking information.
        // TODO - Request Mocking Information (Flag an endpoint with Activity.)
      }

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

  function match(request){
    var found = null;

    console.log('Request ', request.url , '---', request.method);

    server.paths.forEach(function(path, index, array){

      if(found) return;
      console.log('Endpoint', path.regexp, '---', path.endpoint.method);
      console.log('1');

      // Match Method (GET/POST/PUT/DELETE/PATCH)
      if(path.endpoint.method != request.method) return;
      console.log('2');

      // Match the path
      path.regexp.lastIndex = 0; // resetting the last regex.
      console.log('PATH', path);
      console.log('request.url', request.url);
      found = path.regexp.exec(request.url);

      console.log('3');
      console.log('found', found);
      // If path and method both matches, return the path.
      if(found) {
        console.log('Matched');
        // If the request survives until this point, it is the match.

        // NOTES FOR TOMORROW
        // TODO 1 : Greab the header X-AG-EXPECTED-STATUS
        // TODO 2 : Grab response[endpoint-uuid][X-AG-EXPECTED-STATUS]
        // TODO 3 : Send the response back with Found
        // TODO 4 : Replace variables in the response with the given variables

        found.endpoint = path.endpoint;
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
          var code = [];
          code[response.status] = response;
          responses[response['item.uuid']] = code;
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
    console.log('All Paths', paths);

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
