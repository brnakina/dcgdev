var	util = require('util'),
	settings = require('../config.js'),

// websocketの待ち受け開始
io = require('socket.io').listen(settings.settings.socket_port),

// 全部屋監視用オブジェクト
rooms = {},

// コントローラを取得
controller = {
	developer	:	require('./controller/developer.js'),
	player		:	require('./controller/player.js')
};

// socket接続を受け付けたイベント
io.sockets.on('connection', function(socket){
	controller.developer.developer(socket, io, villages);
	controller.player.player(socket, io, villages);
});

