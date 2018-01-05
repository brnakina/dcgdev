exports.AppModel = class AppModel
{
    constructor()
    {
        const mysql = require('mysql');
        const settings = require('../config.js').settings;

        this.connection = mysql.createConnection(settings.mysql_conf);
        this.connection.connect();
    }

    execute(sql, params)
    {
        return new Promise((resolve, reject) =>
        {
            // プレースホルダー使ってSQL発行
            var execute = this.connection.query(sql, params, (err, results) =>
            {
                // エラー発生時
                if(err){
                    reject(err);
                }

                // 正常終了時
                resolve(results);
            });
        });
    }
};