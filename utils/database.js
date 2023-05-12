const mysql = require("mysql2/promise");
// const mysql = require("mysql");

require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	dbConnect = mysql.createPool(process.env.JAWSDB_URL);
} else {
	dbConnect = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
}

dbConnect.on("connection", () => {
	console.log("DB connection established");
});

module.exports = dbConnect;
