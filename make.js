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
  server.start();
};
