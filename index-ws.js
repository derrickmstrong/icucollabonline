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

process.on('SIGINT', () => {
    wss.clients.forEach((client) => {
        client.send(`There are ${wss.clients.size} clients connected at this time.`);
        client.close();
    });
    server.close(() => {
        shutDown();
        console.log('Process terminated');
    });
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
 ws.send(`There are ${numClients} clients connected at this time.`);

  db.run(`INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`);

  console.log('Client connected', numClients);
  ws.on('close', (msg) => {
      console.log(`Client disconnected. There are ${numClients} clients connected at this time.`);
    });
  wss.broadcast(`Welcome to the WebSocket server! There are ${numClients} other clients connected at this time.`);
});

/**  End WebSocket code **/

/** Begin Database **/
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE visitors (
        count INTEGER,
        time TEXT
      )`
    );
});

const getCount = () => {
    db.each('SELECT * FROM visitors ORDER BY count DESC', (err, row) => {
        if (err) {
            console.log(err);
        } else {
            console.log(row);
        }
    });
};

const shutDown = () => {
    getCount();
    console.log('Shutting down db...');
    db.close();
}
/** End Database **/