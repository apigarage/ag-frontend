(function(){
  var serverList = [];
  var _ = require('lodash');
  var http = require('http');
  var serverIPC = require('ipc');
  var windowsManager  = require('./windowsManager.js');

  // Maintain a hash of all connected sockets
  var sockets = {}, nextSocketId = 0;
  var server = {};

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
      windowsManager.sendToAllWindows('server-request', req);
      windowsManager.sendToAllWindows('server-response', res);

    }).listen(options.port, function (err) {
      console.log('listening http://localhost:'+ options.port +'/');
      console.log('pid is ' + process.pid);
    });

    setPaths(options.endpoints);

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
  };

  function match(request){
    var found = null;

    console.log('Request ', request.url , '---', request.method);

    server.paths.forEach(function(path, index, array){

      if(found) return;
      console.log('Endpoint', path.regexp, '---', path.endpoint.method);

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
        found.variables = {};
        var i = 0;
        path.variables.forEach(function(variable){
          found.variables[variable] = found[++i]; // ++i because the first element if the full regex match.
        });
      }

    });

    return found;
  }

  function setPaths(endpoints){
    var paths = [];
    _.forEach(endpoints, function(collection){
      // console.log('Collection', collection);
      _.forEach(collection.items, function(endpoint){

        // Matching patch
        // TODO - ☒ Setting up Regular Expression to Start Server
        // TODO - ☒ Add optional '/' in the beginning and at the end.
        // TODO - ☒ Use case : variable is at the end of the URL
        // TODO - ☒ Use case : URL includes email (either as a URL or a query param)

        // TODO - Check, if the endpoint is mock ready.
        // Is it migrated from environments to host?

        // Extracting Variables Keys
        // TODO - endpoint URL will be replaced by endpoint path after environments to host migration.
        var variables = endpoint.url.match(/{{.*}}/gi);
        variables = _.map(variables, function(variable){
          return variable.substring(2, variable.length-2); // removeing '{{' & '}}'
        });

        // Matching and Extracting Variables Values
        // TODO - endpoint URL will be replaced by endpoint path after environments to host migration.
        endpoint.path = endpoint.url.replace(/{{.*}}/, '([a-zA-Z0-9\-]*)');
        endpoint.path = '^\/*' + endpoint.path + '\/*$'; // slashes in the beggining and at the end.
        var regexp = new RegExp(endpoint.path, 'gi');

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
