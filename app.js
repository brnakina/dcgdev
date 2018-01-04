var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketAppController = require('./server/socketio/controller/AppController.js');

// TODO まだVIEWへ直結しておく
app.get('/', function(req, res){
	res.sendFile(__dirname + '/server/express/view/index.html');
});

// javascript css image等をクライアントに直接返す設定
app.use(express.static('public'));

// socket.ioのイベント受け付け
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

    // 初期化
    socket.on('init', function(params){
        const battle = {
            pp: {
                current: 5,             // 現在のMP
                max: 10                 // 現在の最大MP
            },
            turn: 7,                    // 現在のターン(1から始まる)
            initiative: true,           // 先攻後攻(boolean true: 先攻, false: 後攻)
            initiativeUserId: 1,       // 先攻のユーザーID
            mine: {
                userId: 1,              // ユーザーID
                name: 'test1',          // ユーザー名
                hp: {
                    current: 17,        // 現在のHPcurrent
                    max: 20             // 最大HP
                },
                hands: [// 手札配列
                    {
                        playerCardId: 2,
                        card: {
                            id: 1,
                            hp: 2,
                            attack: 2,
                            cost: 2,
                            name: 'あいうえお'
                        }
                    },
                    {
                        playerCardId: 3,
                        card: {
                            id: 2,
                            hp: 3,
                            attack: 3,
                            cost: 2,
                            name: 'かきくけこ'
                        }
                    },
                    {
                        playerCardId: 4,
                        card: {
                            id: 2,
                            hp: 4,
                            attack: 4,
                            cost: 6,
                            name: 'さしすせそ'
                        },
                    }
                ],
                fields: [// 場札配列
                    {
                        playerCardId: 4,
                        state: 1,
                        card: {
                            id: 26,
                            hp:  { current: 4, max: 5 },
                            attack: 4,
                            cost: 6,
                            name: 'さしすせそ'
                        },
                    },
                    {
                        playerCardId: 4,
                        state: 1,
                        card: {
                            id: 99,
                            hp:  { current: 3, max: 3 },
                            attack: 7,
                            cost: 6,
                            name: 'さしすせそ'
                        },
                    }
                ]
            },

            opp: {
                userId: 2,              // ユーザーID
                name: 'test2',          // ユーザー名
                hp: {
                    current: 19,        // 現在のHP
                    max: 20             // 最大HP
                },
                hands: [// 手札配列
                    {}, {}, {}, {}
                ],
                fields: [// 場札配列
                    {
                        playerCardId: 4,
                        card: {
                            id: 2,
                            hp:  { current: 10, max: 10 },
                            attack: 4,
                            cost: 2,
                            name: 'さしすせそ'
                        },
                    }
                ]
            },

        };
        io.emit('init_done', battle);
    });

});

// HTTP待ち受け開始
http.listen(3000, function(){
	console.log('listening on *:3000');
});