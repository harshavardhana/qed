var fs = require('fs');
var WebSocket = require('ws');
var serverHost = 'ws://qed.zone:4002';
var wsClient = new WebSocket(serverHost);

if (process.argv.length > 2) {
  wsClient.on('open', function() {
    console.log ('connected');
    fs.readFile(process.argv[process.argv.length - 1], function(err, data) {
      console.log(data);
      if (err)
        throw err;
      wsClient.send(data, function(error) {
        if (error)
          console.log (error);
      });
    });
  });
}

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