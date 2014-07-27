#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var errors = require('./errors.js');

var server_obj = { hostName: 'localhost',
                   port: 4002,
                   wsServer: null};
try {
  server_obj.wsServer = new WebSocketServer({host: server_obj.hostName,
                                             port: server_obj.port});
} catch (e) {
  throw new errors.ServerException(e)
}


function send_message_data(data, client) {
  if (!data)
    throw new errors.ServerException("Invalid data");
  client.send (data);
}

function send_message_all_clients(data) {
  for (var i in this.clients)
    send_message_data (data, this.clients[i])
}

server_obj.wsServer.on('connection', function(ws) {
  ws.on('message', function(message) {
    switch (message.client_type) {
    case "CONTROLLER":
      console.log ("Skip controller node");
      break;
    case "VIEWER":
      console.log('broadcasting message to all clients');
      server_obj.broadcast(message.data);
      break;
    default:
      console.log ("Skip un-supported mode");
    }
  });
});

console.log('Listening to ' + server_obj.hostName + ':' + server_obj.port + ' ...');
