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

var fs = require('fs');
var WebSocket = require('ws');
var errors = require('./errors');
var config = require('./config');

try {
  var serverHost = 'ws://' + config.ws.host + ':' + config.ws.port;
  var wsClient = new WebSocket(serverHost);
}
catch (e) {
  throw new errors.ClientException(e)
}

var send_obj = {};
send_obj.type = "NONE";
send_obj.data = null;
send_obj.keyevent = "";

wsClient.on('open', function() {
  console.log ('connected');
  /*
    fs.readFile(process.argv[process.argv.length - 1], function(err, client_data) {
    if (err)
    throw err;
    send_obj.client_data = data;
  */
  send_obj.type = "CONTROLLER";
  send_obj.data = "Hello brother";
  wsClient.send(JSON.stringify(send_obj), function(error) {
    if (error)
      console.log (error);
  });
});

wsClient.on('close', function() {
  console.log('disconnected');
});

wsClient.on('message', function(data, flags) {
  fs.writeFile('test.pdf', data, function (err) {
    if (err)
      throw err;
    console.log('It\'s Saved!');
  });
});
