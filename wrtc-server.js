#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var PeerServer = require('peer').PeerServer;
var ServerException = require('./errors').ServerException;

var opts = require('optimist')
  .usage('Usage: $0')
  .options({
    port: {
      demand: true,
      alias: 'p',
      description: 'port'
    },
    path: {
      demand: false,
      description: 'custom path',
    default: '/qed'
    },
    timeout: {
      demand: false,
      alias: 't',
      description: 'timeout (milliseconds)',
    default: 5000
    },
    concurrent_limit: {
      demand: false,
      alias: 'c',
      description: 'concurrent limit',
    default: 1000
    },
    debug: {
      demand: false,
      alias: 'd',
      description: 'debug',
    default: false
    },
    allow_discovery: {
      demand: false,
      description: 'allow discovery of peers'
    }
  })
  .boolean('allow_discovery')
  .argv;

try {
  if (opts.sslkey && opts.sslcert) {
    opts['ssl'] = {};
    opts.ssl['key'] = fs.readFileSync(path.resolve(opts.sslkey));
    opts.ssl['certificate'] = fs.readFileSync(path.resolve(opts.sslcert));
  }
} catch (e) {
  throw new ServerException(e);
}

try {
  var server = new PeerServer(opts);
} catch (e) {
  throw new ServerException(e);
}

console.log('Started RTCServer, port: ' + opts.port + ', path: ' + opts.path);
