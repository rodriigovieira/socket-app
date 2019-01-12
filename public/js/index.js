var socket = io();

socket.on('connect', function () {
  console.log('Connected from client.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from client.');
});

socket.on('newMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var li = $('<li></li>')
  li.text(`${data.from} ${formattedTime}: ${data.text}`)

  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function () {
    $('[name=message]').val('');
  })
})

var buttonLocation = $('#button-location');

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>')
  var a = $('<a target="_blank">My Current Location</a>')

  li.text(`${message.from} ${formattedTime}: `)
  a.attr('href', message.url)
  li.append(a);
  $('#messages').append(li);
});

buttonLocation.on('click', function (e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  buttonLocation.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    buttonLocation.removeAttr('disabled').text('Sent Location');
  }, function () {
    alert('Unable to fetch location.');
    buttonLocation.removeAttr('disabled').text('Sent Location');
  })

})
