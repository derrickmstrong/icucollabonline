const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname }); // __dirname is the absolute path to the directory containing the executing file.');
});

server.on('request', app);
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

/**  Begin WebSocket code **/ 
const WebSocket = require('ws').Server;
const wss = new WebSocket({ server });

wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  ws.send('Welcome to the WebSocket server!');
  console.log('Client connected', numClients);

  ws.on('close', (msg) => {
      console.log(`Client disconnected. There are ${numClients} clients connected at this time.`);
    });
  wss.broadcast(`Welcome to the WebSocket server! There are ${numClients} other clients connected at this time.`);
});