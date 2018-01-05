const AppController = require('../AppController.js').AppController;

exports.GameController = class GameController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);

        // ゲーム初期化
        socket.on('init@game', params =>
        {
            socket.emit('init_done@game', this.battle);
        });
    }
}