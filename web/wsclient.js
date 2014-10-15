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

var config = {}
config.ws = {}
config.ws.host = "localhost";
config.ws.port = 4002;

var WS = {
  host: config.ws.host,
  port: config.ws.port,
  client: null,
  message: {},

  start: function (viewer) {
    var serverHost = 'ws://' + this.host + ':' + this.port;
    this.client = new WebSocket(serverHost);
    var _this = this;
    this.client.addEventListener("open", function(event) {
      console.log('connected');
      if (_this.client.readyState != WebSocket.OPEN)
        throw new Error('Not connected');
      var message = {
        clientType: viewer,
        fname: null,
        event: 'init'
      };
      _this.client.send(JSON.stringify(message));
    });
    this.client.addEventListener('close', function(event) {
      console.log('disconnected');
    });
    this.client.addEventListener('message', function(event) {
      var data = JSON.parse(event.data);
      if (data.event == 'error') {
        throw new Error('Server reported send error for file ' + data.path);
      } else if (data.event == 'complete') {
        console.log('Server reported send file: ' + data.path + ' Success');
        var event = document.createEvent('UIEvents');
        event.initUIEvent('openpdf', false, false, window, 0);
        event.pdfpath = data.path;
        window.dispatchEvent(event);
      } else if (data.event == 'key') {
        var event = document.createEvent('UIEvents');
        event.initUIEvent('keypressedremote', false, true, window, 0);
        event.keyevent = data.keyevent;
        window.dispatchEvent(event);
      }
    });
  },
  sendFile: function(file, viewer) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.clientType = viewer;
    this.message.fname = file.name;
    this.message.event = 'pdf';
    this.client.send(JSON.stringify(this.message));
    this.client.send(file);
  },
  sendKeyStroke: function(keyevent, viewer) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.clientType = viewer;
    this.message.fname = null;
    this.message.event = 'key';
    this.message.keyevent = {};
    this.message.keyevent.keyCode = keyevent.keyCode;
    this.message.keyevent.cmd = ((keyevent.ctrlKey ? 1 : 0) |
                                 (keyevent.altKey ? 2 : 0) |
                                 (keyevent.shiftKey ? 4 : 0) |
                                 (keyevent.metaKey ? 8 : 0));
    this.client.send(JSON.stringify(this.message));
  }
};
