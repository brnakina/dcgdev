const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const util = require('util');

// TODO まだVIEWへ直結しておく
app.get('/', function(req, res){
	res.sendFile(__dirname + '/server/express/view/index.html');
});

// javascript css image等をクライアントに直接返す設定
app.use(express.static('public'));

// 全部屋監視オブジェクト
const rooms = {};

io.on('connection', function(socket){

    // 接続時
    console.log('a user connected:' + socket.id);

    // controllerを読み込み
    fs.readdir('./server/socketio/controller', (err, files) => {
        if(err) throw err;
        files.forEach(file => {
            const controller = require('./server/socketio/controller/' + file);
            new controller[file.replace(/\.js$/, '')](io, socket, rooms);
        });
    });

    // 切断時
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // events
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

// HTTP待ち受け開始
http.listen(3000, function(){
    console.log('listening on *:3000');
});