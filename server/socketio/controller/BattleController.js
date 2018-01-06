const AppController = require('../AppController.js').AppController;
const BattleService = require('../model/Service/BattleService.js').BattleService;

exports.BattleController = class BattleController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);

        this.BattleService = new BattleService();
        this.battle =  this.BattleService.init();

        // バトル初期化
        socket.on('init@battle', params =>
        {
            socket.emit('receive@battle', this.battle);
        });

        // ターンエンド
        socket.on('turnEnd@battle', params =>
        {
            this.battle.pp.current += 1;
            io.sockets.emit('receive@battle', this.battle);
        });
    }
}