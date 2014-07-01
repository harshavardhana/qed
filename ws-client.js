var WebSocket = require('ws');
var wsClient = new WebSocket('ws://qed.zone:4002');
var i = 0;

wsClient.on('open', function() {
  console.log('connected');
  wsClient.send(i.toString(), function(error) {
    if (error)
      console.log (error);
  });
});

wsClient.on('close', function() {
  console.log('disconnected');
});

wsClient.on('message', function(data, flags) {
  console.log("Received: (" + data + ")");
  i = parseInt(data) + 1;
  setTimeout(function() {
    wsClient.send(i.toString(), function(error) {
      if (error)
        console.log (error);
    });
  }, 500);
});
