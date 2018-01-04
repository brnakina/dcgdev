Main.socket_io = (function(){

	var socket = io();

	socket.emit('init');

	socket.on('init_done', Main.refresh);

	$('form').submit(function(){
	  socket.emit('chat message', $('#m').val());
	  $('#m').val('');
	  return false;
	});

	socket.on('chat message', function(msg){
	  $('#messages').append($('<li>').text(msg));
	});

}());