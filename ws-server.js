#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var hostName = 'qed.zone';
var port = 4002;

var wsServer = new WebSocketServer({host: hostName, port: port});

wsServer.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

wsServer.on('connection', function(ws) {
  ws.on('message', function(message) {
    switch (message.client_type) {
    case "CONTROLLER":
      console.log ("Skip controller node");
      break;
    case "VIEWER":
      console.log('broadcasting message to all clients');
      wsServer.broadcast(message);
      break;
    default:
      console.log ("Skip un-supported mode");
    }
  });
});

console.log('Listening to ' + hostName + ':' + port + ' ...');
