const AppDao = require('../AppDao.js').AppDao;

exports.CardsDao = class CardsDao extends AppDao
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