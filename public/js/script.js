var socket = io.connect('http://localhost');
console.log('what in the fack');
//var username = prompt('Choose a username!');

socket.on('connect', function () {
	$('#popup-username').fadeIn(150);
});

$('#form-text-input').on('submit', function (event) {
	event.preventDefault();


});