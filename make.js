/*
 * Copyright 2014 Hyperbotics.org
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

require('shelljs/make');
var path = require('path');
var fs = require('fs');

var ROOT_DIR = __dirname + '/'; // absolute path to project's root

target.server = function() {
  cd(ROOT_DIR);
  echo();
  echo('### Starting local server');

  var WebServer = require('./server.js').WebServer;
  var server = new WebServer();
  server.port = 4001;
  server.root = "web";
  server.start();
};