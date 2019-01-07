const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('Connected from end A.');

  socket.on('disconnect', () => {
    console.log('Disconnected from client.');
  })
});

server.listen(port, () => {
  console.log('The server is up and running.');
});
