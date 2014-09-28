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
var errors = require('./errors');
var wsocket = require('ws').Server;

function WebSocketServer() {
  this.host = 'localhost';
  this.port = '4002';
  this.wsserver = null;
  this.clients = [];
}

function send_message_data(data, client) {
  if (!data)
    throw new errors.ServerException("Invalid data");
  // ArrayBuffer is automatically discovered and set
  client.send (data);
}

WebSocketServer.prototype = {
  start: function (callback) {
    this.wsserver = new wsocket({host: this.host,
                                 port: this.port,
                                 clientTracking: false,
                                 callback: callback});
    var _this = this;
    this.wsserver.on('connection', function(ws) {
      // keep clients list for future use
      ws.on('message', function(message) {
        var client = JSON.parse(message);

        if (client.type === 'NONE') {
          console.log ("Unrecognized client");
        }

        _this.clients.push({
          type: client.type,
          conn: ws
        });

        if (client.type === 'CONTROLLER') {
          if (client.data) {
            send_message_all_clients (client.data);
          }
        }
        console.log(_this.clients);
      });

      ws.on('close', function() {
        var i = 0;
        var tot = 0;
        for (tot=_this.clients.length; i < tot; i++) {
          if (_this.clients[i].conn === ws)
            _this.clients.splice(i, 1);
        }
      });

      function send_message_all_clients(data) {
        var i = 0;
        var tot = 0;
        for (tot=_this.clients.length; i < tot; i++) {
          // Send controller node data to clients
          if (_this.clients[i].type === 'CLIENT')
            send_message_data (data, _this.clients[i].conn)
        }
      }
    });
    console.log(
      'Socket server running at ws://' + this.host + ':' + this.port + ' ...'
    );
  },
  stop: function() {
    this.wsserver.close();
    this.wsserver = null;
  }
};

module.exports = WebSocketServer;
