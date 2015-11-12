(function(){
  var serverList = [];
  var currentChildProcess;
  var http = require('http');
  var serverIPC = require('ipc');
  var server;
  var windowsManager  = require('./windowsManager.js');

  // Maintain a hash of all connected sockets
  var sockets = {}, nextSocketId = 0;

  module.exports.createServer = function(port){
    console.log("start", port);

    server = http.createServer(function (req, res) {
      // unclear why it is sending twice
      // request headers always has response
      // we query the response and return it as is.
      // we would need a localStorage for all the response
      // need to define what makes a unique request
      // figure out where in the file system it is creating the server

      setTimeout(function () { //simulate a long request
        if(req.method =='POST'){
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('POST Hello World\n');
        }else{
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('Hello World\n');
        }

        // send message back
        windowsManager.sendToAllWindows('server-request', req);
        windowsManager.sendToAllWindows('server-response', res);
      }, 1000);
    }).listen(port, function (err) {
      console.log('listening http://localhost:'+port+'/');
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

  };

  module.exports.stopServer = function(){
    console.log("stop");
    for (var socketId in sockets) {
      console.log('socket', socketId, 'destroyed');
      console.log('socket', sockets[socketId]);
      sockets[socketId].destroy();
    }
    server.close();
  };


})();
