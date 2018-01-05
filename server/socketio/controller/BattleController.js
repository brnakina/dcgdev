const AppController = require('../AppController.js').AppController;

exports.BattleController = class BattleController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);

        // バトル初期化
        socket.on('init@battle', params =>
        {
            socket.emit('init_done@battle', this.battle);
        });
    }
}