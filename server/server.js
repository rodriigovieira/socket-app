const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validator');

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

  console.log('Connected to the server.');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room are required.');
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server.');
  });
});

server.listen(port, () => {
  console.log('The server is up and running.');
});
