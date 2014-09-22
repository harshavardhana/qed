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
                                             port: ws_obj.port});
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

ws_obj.wsServer.on('connection', function(ws) {
  ws.on('message', function(message) {
    switch (message.client_type) {
    case "CONTROLLER":
      console.log ("Skip controller node");
      break;
    case "CLIENT":
      console.log('broadcasting message to all clients');
      ws_obj.broadcast(message.data);
      break;
    default:
      console.log ("Skip un-supported mode");
    }
  });
});

console.log('Listening to ' + ws_obj.hostName + ':' + ws_obj.port + ' ...');
