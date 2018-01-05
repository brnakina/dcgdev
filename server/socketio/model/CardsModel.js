const AppModel = require('../AppModel.js').AppModel;

exports.CardsModel = class CardsModel extends AppModel
{
    constructor()
    {
        super();
    }

    getCardById(id)
    {
        const sql = "SELECT * FROM cards WHERE id = ?;";
        return this.execute(sql, [id]);
    }
}