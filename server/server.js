const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connect', (socket) => {
  socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });

  socket.on('createMessage', (data) => {
    console.log(`Message: ${data}`);
  });

  socket.emit('newMessage', {
    from: 'John',
    text: 'masterPiece',
    createdAt: 904293493,
  });

  console.log('Connected from the server.');
});

server.listen(port, () => {
  console.log('The server is up and running.');
});
