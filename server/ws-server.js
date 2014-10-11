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
  this.root = ".";
  this.clients = [];
}

function send_message_data(data, client) {
  if (!data)
    throw new errors.ServerException("Invalid data");
  // ArrayBuffer is automatically discovered and set
  client.send (data);
}

Object.prototype.isEmpty = function() {
  for (var prop in this) {
    if (this.hasOwnProperty(prop))
      return false;
  }
  return true;
};

WebSocketServer.prototype = {
  init: function() {
    var uploaddir = this.root + '/uploaded';
    fs.mkdir(uploaddir, function(error) {
      // ignore errors, most likely means directory exists
      console.log('Uploaded files will be saved to %s', uploaddir);
      console.log('Remember to wipe this directory if you upload lots and lots.');
    });
  },
  start: function (callback) {
    this.wsserver = new wsocket({host: this.host,
                                 port: this.port,
                                 clientTracking: false,
                                 callback: callback});
    var _this = this;
    this.wsserver.on('connection', function(ws) {
      // keep clients list for future use
      var file = null;
      ws.on('message', function(data, flags) {
        if (!flags.binary) {
          file = JSON.parse(data);
          if (file.name == null) {
            _this.clients.push({
              type: file.client_type,
              conn: ws
            });
          }
        } else {
          var file_rel_name = _this.root + '/uploaded/' + file.name;
          fs.writeFile(file_rel_name, data, function(error) {
            if (error) {
              console.log(error);
              ws.send(JSON.stringify({event: 'error',
                                      path: file_rel_name,
                                      message: error.message}));
              return;
            } else {
              ws.send(JSON.stringify({event: 'complete',
                                      path: file_rel_name}));
              file = null;
            }
          });
        }
      });

      ws.on('close', function() {
        var i = 0;
        var tot = 0;
        for (tot=_this.clients.length; i < tot; i++) {
          if (_this.clients[i].conn === ws)
            _this.clients.splice(i, 1);
        }
      });

      ws.on('error', function(e) {
        console.log('Client error: %s', e.message);
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
  }
};

module.exports = WebSocketServer;
