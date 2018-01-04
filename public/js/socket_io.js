Main.socket_io = (function(){

	var socket = io();

	socket.emit('init');

	socket.on('init_done', function(battle){
	    Main.init(battle);
	    Main.refresh(battle);
	})
//
//	$('form').submit(function(){
//	  socket.emit('chat message', $('#m').val());
//	  $('#m').val('');
//	  return false;
//	});
//
//	socket.on('chat message', function(msg){
//	  $('#messages').append($('<li>').text(msg));
//	});

}());