exports.AppDao = class AppDao
{
    constructor()
    {
        const mysql = require('mysql');
        const settings = require('../../config.js').settings;

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
                const rets = results.map(result =>
                {
                    const ignoreColumns = ["created_at", "creater", "updated_at", "updater"];
                    const ret = {};
                    for(let key in result){
                        if(ignoreColumns.indexOf(key) < 0){
                            ret[key.toLowerCase().replace(/_./g, x => {return x.charAt(1).toUpperCase()})] = result[key];
                        }
                    }
                    return ret;
                });
                resolve(rets);
            });
        });
    }
};