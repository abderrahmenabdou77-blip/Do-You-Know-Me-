const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { roomHandler } = require('./socket/roomHandler');
const { gameHandler } = require('./socket/gameHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  roomHandler(io, socket);
  gameHandler(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎮 Know Your Friend server running at http://localhost:${PORT}\n`);
});
