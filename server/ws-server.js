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
  this.pobject = null;
}

function send_message_data(data, client) {
  // ArrayBuffer is automatically discovered and set
  if (!data)
    throw new errors.ServerException("Invalid data");
  client.send (data);
}

function isEmptyObj(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

function iptoProjector(obj, address) {
  var projector = "";
  switch (address) {
  case obj.projector1:
    projector = "projector1";
    break;
  case obj.projector2:
    projector = "projector2";
    break;
  case obj.projector3:
    projector = "projector3";
    break;
  default:
    projector = "presenter";
  }
  return projector;
}

function ProjectorToPage(obj) {
  //
}

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
      var message = null;
      ws.on('message', function(data, flags) {
        if (isEmptyObj(ws.upgradeReq))
          throw new errors.ServerException("Corrupted object");
        var remoteaddress = ws.upgradeReq.connection.remoteAddress;
        // if PDF data check to break out
        if (!flags.binary) {
          message = JSON.parse(data);
          if (message.fname == null) {
            if (message.event == 'init') {
              if (isEmptyObj(_this.pobject))
                throw new errors.ServerException("Empty object");
              var projector = iptoProjector(_this.pobject, remoteaddress)
              _this.clients.push({
                type: projector,
                conn: ws,
                address: remoteaddress,
              });
            } else if (message.event == 'key') {
              var data = JSON.stringify({event: 'key',
                                         keyevent: message.keyevent});
              var i = 0;
              var tot = 0;
              for (tot=_this.clients.length; i < tot; i++) {
	        if (typeof _this.clients[i] !== 'undefined') {
                  if (typeof _this.clients[i].conn !== 'undefined') {
                    if (_this.clients[i].type == 'projector2' ||
                        _this.clients[i].type == 'presenter') {
                      send_message_data(data, _this.clients[i].conn);
                    }
                  }
                }
              }
            } else if (message.event == 'zoom') {
              var data = JSON.stringify({event: 'zoom',
                                         clickevent: message.clickevent});
              send_message_all_clients(data);
            } else if (message.event == 'select') {
              var data = JSON.stringify({event: 'select',
                                         scale: message.scale});
              send_message_all_clients(data);
            }
          }
        } else {
          var fname = _this.root + '/uploaded/' + message.fname;
          var replyfname = '/uploaded/' + message.fname;
          fs.writeFile(fname, data, function(error) {
            if (error) {
              console.log(error);
              send_message_all_clients(JSON.stringify({event: 'error',
                                                       path: replyfname,
                                                       message: error.message}));
              return;
            } else {
              send_message_all_clients(JSON.stringify({event: 'complete',
                                                       path: replyfname}));
              message = null;
            }
          });
        }
      });

      ws.on('close', function() {
        var i = 0;
        var tot = 0;
        for (tot=_this.clients.length; i < tot; i++) {
          if (typeof _this.clients[i] !== 'undefined') {
            if (_this.clients[i].conn === ws)
              _this.clients.splice(i, 1);
          }
        }
      });

      function send_message_all_clients(data) {
        var i = 0;
        var tot = 0;
        for (tot=_this.clients.length; i < tot; i++) {
	  if (typeof _this.clients[i] !== 'undefined') {
            if (typeof _this.clients[i].conn !== 'undefined')
               send_message_data (data, _this.clients[i].conn)
          }
        }
      }

      ws.on('error', function(e) {
        console.log('Client error: %s', e.message);
      });
    });
    console.log(
      'Socket server running at ws://' + this.host + ':' + this.port + ' ...'
    );
  }
};

module.exports = WebSocketServer;
