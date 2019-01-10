const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('createMessage', (data, callback) => {
    console.log(`Message: ${data}`);
    io.emit('newMessage', generateMessage(data.from, data.text));
    callback('test dummy');
  });

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat room.'));
  
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

  console.log('Connected from the server.');

  socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });
});

server.listen(port, () => {
  console.log('The server is up and running.');
});
