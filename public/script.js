var socket = io.connect('http://localhost');



socket.on('connect', function () {
	$('#popup-username').fadeIn(150);
});

socket.on('user disconnected', function (username, userId) {
	$('#user-' + userId).remove();

	var message = username + ' has disconnected';
	addMessage('server', message);
});

socket.on('new user', function (username, userId) {
	var message = username + ' has joined the chat.';

	addUser(username, userId);
	addMessage('server', message);

});

function addMessage(from, message) {
	var $li = $('<li class="message"></li>');

	if (from === 'server') {
		$li.addClass('server');
	}
	$li.html(from + ': ' + message);

	$('#messages').append($li);
}

function addUser (username, userId) {
	var $li = $('<li id="user-' + userId + '" class="user"></li>');

		$li.html(username);
		$('#connected-users').append($li);
}

function removeUser (username) {

}


$('#form-create-username').on('submit', function (event) {
	event.preventDefault();

	var username = $('#input-username').val();

	socket.emit('username', username);
});

socket.on('user exists', function () {
	alert("Ce nom d'user est déjà parti, veulliez choisir un autre.");
	$('#input-username').val('');
});

socket.on('username created', function (connectedUsers) {
	for (var i = 0; i < connectedUsers.length; i++) {
		addUser(connectedUsers[i].username, connectedUsers[i].userId);
	}

	$('#popup-username').fadeOut(150);
});

$('#form-text-input').on('submit', function (event) {
	event.preventDefault();

	var message = $('#text-input').val();
	$('#text-input').val('');

	socket.emit('message', message);

});

socket.on('new message', addMessage);

