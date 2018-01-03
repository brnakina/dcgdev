var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/server/view/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){

	// 接続時
	console.log('a user connected');

	// 切断時
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	// events
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

});

http.listen(3000, function(){
	console.log('listening on *:3000');
});