var mysql = require('mysql'),
mysql_conf = {
	host		: 'mysql',
	user		: 'root',
	password	: 'pass',
	database	: 'dcgdev'
};

exports.connection = mysql.createConnection(mysql_conf);
exports.connection.connect();
