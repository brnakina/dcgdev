$(function(){

    var socket = io();

    // TODO 仮実装
    socket.emit('init@battle');

    socket.on('receive@battle', battle =>
    {
        Main.refresh(battle);
    })

    Main.socket_io = {
        socket: socket
    }
//    $('form').submit(function(){
//      socket.emit('chat message', $('#m').val());
//      $('#m').val('');
//      return false;
//    });
//
//    socket.on('chat message', function(msg){
//      $('#messages').append($('<li>').text(msg));
//    });
});