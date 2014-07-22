var express = require('express'),
		http = require('http'),
		$ = require('jQuery'),


		sio = require('socket.io'),

		app = express(),
		server = http.createServer(app),

		io = sio.listen(server);

app.set('port', process.env.PORT || 4444);

app.use(express.bodyParser());
app.use(express.static('public'));
app.use(express.cookieParser());
app.use(function(req, res, next) {
	res.set('Access-Control-Allow-Origin', 'http://locahost');
res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	next();
}); 

var connections = {},
		connectionId = 0;

io.sockets.on('connection', function (socket) {
	console.log('someone connected');
	console.log(connections);

	socket.on('username', function (username) {
		if (connections.username) {
			socket.emit('user exists');
		} else {
			var connectedUsers = [];

			socket.username = username;
			socket.userId = connectionId++;

			connections[socket.username] = {
				username: socket.username,
				userId: socket.userId,
				socket: socket
			};

			for (var key in connections) {
				var data = {};

				data.username = connections[key].username;
				data.userId = connections[key].userId;

				connectedUsers.push(data);

				if (key !== socket.username) {
					connections[key].socket.emit('new user', socket.username, socket.userId);		
				}
			}

			socket.emit('username created', connectedUsers);
		}

	});

	socket.on('message', function (message) {
		console.log(socket);
		for (var key in connections) {
			connections[key].socket.emit('new message', socket.username, message);	
		}
		
	});

	socket.on('disconnect', function () {
		delete connections[socket.username];

		for (var key in connections) {
			connections[key].socket.emit('user disconnected', socket.username, socket.userId);	
		}		

	});
})


server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});