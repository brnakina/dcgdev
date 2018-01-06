const AppModel = require('../AppService.js').AppService;

exports.BattleService = class BattleService extends AppService
{
    constructor(gameId, mine, opp)
    {
        super();

        this.battle = {
            turn: {
                id:     ""          // 現在のターンのsocket.id
                number: 1           // 現在のターン(1から始まって先攻、後攻の行動が終わって１インクリメントされる)
            },
            initiative: true,       // 先攻後攻(boolean true: 先攻, false: 後攻)
            initiativeUserId: 1,    // 先攻のsocket.id
        };
    }
}