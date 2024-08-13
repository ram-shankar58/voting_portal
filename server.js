const WebSocket = require('ws');
const http = require('http');

// Create the HTTP server and attach the WebSocket server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Votes tracking object
let votes = { for: 0, against: 0 };
const userVotes = {}; // Track user votes by userId

// Password for resetting votes
const resetPassword = 'sedsantarikshforever';

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Send the current votes to the newly connected client
  ws.send(JSON.stringify(votes));

  ws.on('message', (message) => {
    try {
      const { type, userId, password } = JSON.parse(message);

      if (type === 'for' || type === 'against') {
        // Adjust previous vote
        if (userVotes[userId]) {
          if (userVotes[userId] === 'for') {
            votes.for -= 1;
          } else if (userVotes[userId] === 'against') {
            votes.against -= 1;
          }
        }

        // Update user vote and count the new vote
        userVotes[userId] = type;

        if (type === 'for') {
          votes.for += 1;
        } else if (type === 'against') {
          votes.against += 1;
        }
      } else if (type === 'reset' && password === resetPassword) {
        // Reset votes if the correct password is provided
        votes = { for: 0, against: 0 };
        Object.keys(userVotes).forEach((key) => delete userVotes[key]);
      }

      // Broadcast updated votes to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(votes));
        }
      });
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Listen on the port provided by Render or default to 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
