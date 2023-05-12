require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	const mysql = require("mysql");
	dbConnect = mysql.createConnection(process.env.JAWSDB_URL);
	dbConnect.connect();
	dbConnect.on("connection", () => {
		console.log("DB connection established");
	});
	dbConnect.on("error", () => {
		console.log("DB connection could not be established");
	});
} else {
	const mysql = require("mysql2/promise");
	dbConnect = mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
	dbConnect.on("connection", () => {
		console.log("DB connection established");
	});
	dbConnect.on("error", () => {
		console.log("DB connection could not be established");
	});
}

module.exports = dbConnect;
