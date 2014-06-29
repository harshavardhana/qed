#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xhtml': 'application/xhtml+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.log': 'text/plain',
  '.bcmap': 'application/octet-stream',
  '.properties': 'text/plain'
};

var ipAddress = 'qed.zone';
var port = 4002;
var defaultMimeType = 'application/octet-stream';

var wsServer = new WebSocketServer({host: ipAddress, port: port});

wsServer.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

wsServer.on('connection', function(ws) {
  ws.on('message', function(message) {
    wsServer.broadcast(message);
    console.log('received: %s', message);
  });
});

console.log('Listening to ' + ipAddress + ':' + port + ' ...');
