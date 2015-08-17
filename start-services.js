#!/usr/bin/env node
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

'use script';

var path = require('path');
var fs = require('fs');
var filename = "config.json";
var configObj;

function readProjectorConfig(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if (err)
      throw new Error(err);
    if (typeof data === 'undefined')
      throw new Error("Invalid data");
    callback(null, data);
  });
}

readProjectorConfig(filename, function (err, data) {
  configObj = JSON.parse(data);

  console.log('### Starting local server ');
  var WebServer = require('./server/http-server');
  var SocketServer = require('./server/ws-server');
  var server = new WebServer();
  var socket = new SocketServer();

  server.root = configObj.server.root;
  socket.root = configObj.socket.root;
  server.host = configObj.server.host;
  socket.host = configObj.socket.host;
  server.port = configObj.server.port;
  socket.port = configObj.socket.port;
  var rootPath = configObj.root.path
  if (configObj.root.path === '<placeholder>') {
    rootPath = '.';
  }
  socket.root = rootPath;
  socket.pobject = configObj.projectors; /* Projector list */
  server.start();
  socket.init();
  socket.start();
});
