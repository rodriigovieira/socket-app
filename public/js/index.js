var socket = io();

socket.on('connection');

var roomName = document.querySelector('#room-name-chooser');

var selection = document.createElement('select');
selection.id = 'full-selector';

socket.on('roomsList', function (rooms) {
  var fullDiv = document.querySelector('#rooms-list');

  fullDiv.innerHTML = '';

  if (rooms.length > 0) {
    fullDiv.innerHTML = '';
    var firstOption = document.createElement('option');
    firstOption.text = `Create your own!`;
    selection.appendChild(firstOption);

    rooms.forEach(function (room) {
      var option = document.createElement('option');
      option.text = room;
      selection.appendChild(option);
    })

    fullDiv.appendChild(selection);
  } else {
    fullDiv.innerHTML = '';
    fullDiv.innerHTML = `<p>No rooms active.</p>`;
  }
})

selection.addEventListener('change', function (e) {
  if (!(e.target.value === 'Create your own!')) {
    roomName.value = e.target.value;
  } else {
    roomName.value = '';
  }

  roomName.addEventListener('input', function(event) {
    e.target.value = 'Create your own!';
  })
})
