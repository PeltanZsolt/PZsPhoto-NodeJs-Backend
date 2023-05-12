// const mysql = require("mysql2/promise");

// const dbConnect = mysql.createPool({
// 	host: process.env.DB_HOST,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_DATABASE,
// 	multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
// });

// const dbConnect = mysql.createPool({
// 	host: process.env.JAWSDB_HOST,
// 	user: process.env.JAWSDB_USER,
// 	password: process.env.JAWSDB_PASSWORD,
// 	database: process.env.JAWSDB_DATABASE,
// 	multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
// });

var mysql = require("mysql");
require("dotenv").config();
var dbConnect = mysql.createConnection(process.env.JAWSDB_URL);

dbConnect.connect(function (err) {
	if (err) {
		console.log("Error ocured while connecting to database", err);
		throw err;
	}
	console.log("Connected!");
});

module.exports = dbConnect;
