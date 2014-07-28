#!/usr/bin/env node

var path = require('path');
var fs = require('fs')
var PeerServer = require('peer').PeerServer;
var opts = require('optimist')
  .usage('Usage: $0')
  .options({
    debug: {
      demand: false,
      alias: 'd',
      description: 'debug',
    default: false
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
    allow_discovery: {
      demand: false,
      description: 'allow discovery of peers'
    }
  })
  .boolean('allow_discovery')
  .argv;

opts.version = 0.1;
if (opts.sslkey && opts.sslcert) {
  opts['ssl'] = {};
  opts.ssl['key'] = fs.readFileSync(path.resolve(opts.sslkey));
  opts.ssl['certificate'] = fs.readFileSync(path.resolve(opts.sslcert));
}

process.on('uncaughtException', function(e) {
  console.error('Error: ' + e);
});

var server = new PeerServer(opts);
console.log(
  'Started PeerServer, port: ' + opts.port + ', path: ' + (opts.path || '/') + (" (v. %s)"), opts.version
);
