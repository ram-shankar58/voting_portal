// /server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let votes = { for: 0, against: 0 };

wss.on('connection', (ws) => {
  // Send current votes to the newly connected client
  ws.send(JSON.stringify(votes));

  ws.on('message', (message) => {
    const vote = JSON.parse(message);

    // Update votes based on the received vote type
    if (vote.type === 'for') {
      votes.for++;
    } else if (vote.type === 'against') {
      votes.against++;
    }

    // Broadcast the updated votes to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(votes));
      }
    });
  });
});
