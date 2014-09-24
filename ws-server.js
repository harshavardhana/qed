/* Copyright 2014 Harshavardhana <harsha@harshavardhana.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var WebSocketServer = require('ws').Server;

var errors = require('./errors');

var ws_obj = { hostName: 'localhost',
               port: 4002,
               wsServer: null};
try {
  ws_obj.wsServer = new WebSocketServer({host: ws_obj.hostName,
                                         port: ws_obj.port,
                                         clientTracking: false});
} catch (e) {
  throw new errors.ServerException(e);
}

var clients = [];

function send_message_data(data, client) {
  if (!data)
    throw new errors.ServerException("Invalid data");
  client.send (data);
}

function send_message_all_clients(data) {
  var i = 0;
  var tot = 0;
  for (tot=clients.length; i < tot; i++) {
    // Send controller node data to clients
    if (clients[i].type == 'CLIENT')
      send_message_data (data, clients[i].conn)
  }
}

ws_obj.wsServer.on('connection', function(ws) {
  // keep clients list for future use
  ws.on('message', function(message) {
    var client = JSON.parse(message);

    if (client.type === 'NONE') {
      console.log ("Unrecognized client");
    }

    clients.push({
      type: client.type,
      conn: ws
    });

    if (client.type === 'CONTROLLER') {
      if (client.data) {
        send_message_all_clients (client.data);
      }
    }
  });
});

console.log('Listening to ' + ws_obj.hostName + ':' + ws_obj.port + ' ...');
