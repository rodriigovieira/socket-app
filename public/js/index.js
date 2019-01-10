var socket = io();

socket.on('connect', function () {
  console.log('Connected from client.');

  socket.on('newMessage', function (data) {
    console.log('Message', data);
  })

  socket.emit('createMessage', {
    from: 'Tyler',
    text: 'You are dead'
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from client.');
});
