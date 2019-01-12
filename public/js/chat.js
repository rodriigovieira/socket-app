var socket = io();

function scrollToBottom () {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeigth = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeigth = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeigth + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeigth) {
    messages.scrollTop(scrollHeigth);
  }
}

socket.on('connect', function () {
  // console.log('Connected from client.');
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error.');
    }
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from client.');
});

socket.on('newMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: data.from,
    text: data.text,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
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
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  $('#messages').append(html);
  scrollToBottom();
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
