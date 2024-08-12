const WebSocket = require('ws');
const server = require('http').createServer();
const wss = new WebSocket.Server({ server });

let votes = { for: 0, against: 0 };

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(votes));

  ws.on('message', (message) => {
    const { type } = JSON.parse(message);

    if (type === 'for') {
      votes.for += 1;
    } else if (type === 'against') {
      votes.against += 1;
    } else if (type === 'reset') {
      votes = { for: 0, against: 0 };
    }

    // Broadcast the updated votes to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(votes));
      }
    });
  });
});

server.listen(3001, () => {
  console.log('WebSocket server is listening on port 3001');
});
