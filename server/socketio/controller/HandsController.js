const AppController = require('../AppController.js').AppController;
const CardsDao = require('../model/Dao/CardsDao').CardsDao;

exports.HandsController = class HandsController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);

        this.CardsDao = new CardsDao();

        // ゲーム初期化
        socket.on('get@hands', params =>
        {
            this.CardsDao.getCardById(params)
            .then(result => {
                socket.emit('send@hands', result);
            });
        });
    }
}