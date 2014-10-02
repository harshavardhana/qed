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
  supported: "WebSocket" in window,

  start: function (viewer) {
    if (this.supported) {
      var serverHost = 'ws://' + this.host + ':' + this.port;
      this.client = new WebSocket(serverHost);
      this.client.binaryType = "arraybuffer";
      var _this = this;
      this.client.addEventListener("open", function(evt) {
        var message = {
          type: viewer,
          data: null
        };
        _this.client.send(JSON.stringify(message));
        console.log('connected');
      });
      this.client.addEventListener('close', function(evt) {
        console.log('disconnected');
      });
      this.client.addEventListener('message', function(evt) {
        console.log(evt);
        }
      });
    }
  },
  send: function(array) {
    if ((this.client.readyState == 1) && this.supported) {
      if (typeof array !== 'undefined') {
        this.message.type = "CONTROLLER";
        this.message.data = array;
        this.client.send(JSON.stringify(this.message));
        if (this.client.bufferredAmount !== 0) {
          console.log ("Data not sent");
        }
      } else {
        console.log ("Nothing to do");
      }
    }
  }
};
