const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConnect = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
});

module.exports = dbConnect;
