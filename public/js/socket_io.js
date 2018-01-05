Main.socket_io = (function(){

	var socket = io();

	socket.emit('init@game');

	socket.on('init_done@game', function(battle){
	    Main.init(battle);
	    Main.refresh(battle);
	})

	socket.emit('get@hands', 1);
    socket.on('send@hands', function(card){
        console.log(card);
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