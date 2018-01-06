const AppService = require('../AppService.js').AppService;

exports.BattleService = class BattleService extends AppService
{
    constructor(gameId, mine, opp)
    {
        super();
    }

    init()
    {
//        this.battle = {
//            turn: {
//                id:     ""          // 現在のターンのsocket.id
//                number: 1           // 現在のターン(1から始まって先攻、後攻の行動が終わって１インクリメントされる)
//            },
//            initiative: true,       // 先攻後攻(boolean true: 先攻, false: 後攻)
//            initiativeUserId: 1,    // 先攻のsocket.id
//        };

        return {
            pp: {
                current: 1,             // 現在のMP
                max: 10                 // 現在の最大MP
            },
            turn: 1,                    // 現在のターン(1から始まる)
            initiative: true,           // 先攻後攻(boolean true: 先攻, false: 後攻)
            initiativeUserId: 1,       // 先攻のユーザーID
            mine: {
                userId: 1,              // ユーザーID
                name: 'test1',          // ユーザー名
                hp: {
                    current: 20,        // 現在のHPcurrent
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
                fields: [
                ]
            },

            opp: {
                userId: 2,              // ユーザーID
                name: 'test2',          // ユーザー名
                hp: {
                    current: 20,        // 現在のHP
                    max: 20             // 最大HP
                },
                hands: [
                    {}, {}, {}
                ],
                fields: [// 場札配列

                ]
            },
        };
    }
}