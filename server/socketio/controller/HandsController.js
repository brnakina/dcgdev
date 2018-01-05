const AppController = require('../AppController.js').AppController;
const CardsModel = require('../model/CardsModel').CardsModel;

exports.HandsController = class HandsController extends AppController
{
    constructor(io, socket, rooms)
    {
        super(io, socket, rooms);

        this.CardsModel = new CardsModel();

        // ゲーム初期化
        socket.on('get@hands', params =>
        {
            this.CardsModel.getCardById(params)
            .then(result => {
                socket.emit('send@hands', result);
            });
        });
    }
}