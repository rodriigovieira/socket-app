const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validator');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

const server = http.createServer(app);
const io = socketIO(server);

const users = new Users();
const rooms = [];

io.on('connection', (socket) => {
  io.emit('roomsList', rooms);
  
  socket.on('createMessage', (data, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(data.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, data.text));
    }

    callback();
  });

  console.log('Connected to the server.');

  socket.on('join', (params, callback) => {
    const roomUpper = params.room.toUpperCase();

    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room are required.');
    }

    const allUpper = users.getUserList(roomUpper).map(value => value.toUpperCase());
    if (allUpper.includes(params.name.toUpperCase())) {
      return callback('Username already taken. Please choose another one.');
    }

    socket.join(roomUpper);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, roomUpper);
    if (!rooms.includes(roomUpper)) {
      rooms.push(roomUpper);
      console.log(rooms);
      io.emit('roomsList', rooms);
    }

    io.to(roomUpper).emit('updateUserList', users.getUserList(roomUpper));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));
    socket.broadcast.to(roomUpper).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room.`));

    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));

      const foundIndex = rooms.findIndex(value => value.toUpperCase() === user.room.toUpperCase());
      if (users.getUserList(user.room).length === 0) {
        rooms.splice(foundIndex, 1);
        console.log(rooms);
        io.emit('roomsList', rooms);
      }
    }
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });
});

server.listen(port, () => {
  console.log(`The server is up and running at port ${port}.`);
});
