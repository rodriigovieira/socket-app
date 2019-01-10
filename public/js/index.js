var socket = io();

socket.on('connect', function () {
  console.log('Connected from client.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from client.');
});

socket.on('newMessage', function (data) {
  console.log('Message', data);
  var li = $('<li></li>')
  li.text(`${data.from}: ${data.text}`)

  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function () {

  })
})
