var WebSocketClient = require('ws');
var wsClient = new WebSocketClient('ws://qed.zone:4002/',
                                   {protocolVersion: 8,
                                    origin: 'http://websocket.org'});
wsClient.on('open', function() {
  console.log('connected');
  wsClient.send(Date.now().toString(), {mask: true});
});
wsClient.on('close', function() {
  console.log('disconnected');
});
wsClient.on('message', function(data, flags) {
  console.log('Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms', flags);
  setTimeout(function() {
    wsClient.send(Date.now().toString(), {mask: true});
  }, 500);
});
