const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConnect = mysql.createPool({
	host: process.env.MARIADB_HOST,
	user: process.env.MARIADB_USER,
	password: process.env.MARIADB_PASSWORD,
	database: process.env.MARIADB_DATABASE,
	multipleStatements: process.env.MARIADB_MULTIPLE_STATEMENTS,
});

module.exports = dbConnect;
