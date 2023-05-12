const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	console.log("JAWSDB_URL found. Initializing database...");
	dbConnect = mysql.createPool({
		host: process.env.JAWSDB_HOST,
		user: process.env.JAWSDB_USER,
		password: process.env.JAWSDB_PASSWORD,
		database: process.env.JAWSDB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
	dbConnect.on("connection", (mes) => {
		console.log("JAWSDB connection established", mes);
	});
	dbConnect.on("error", (err) => {
		console.log("JAWSDB connection could not be established", err);
	});

	// if (process.env.JAWSDB_URL) {
	// 	console.log("JAWSDB_URL found. Initializing database...");
	// 	dbConnect = mysql.createConnection(process.env.JAWSDB_URL);
	// 	dbConnect.connect();
	// 	dbConnect.on("connection", (mes) => {
	// 		console.log("DB connection established", mes);
	// 	});
	// 	dbConnect.on("error", (err) => {
	// 		console.log("JAWSDB connection could not be established", err);
	// 	});
	// 	const users = dbConnect.query("SELECT * FROM users");
	//     console.log('Users: ', users)
} else {
	dbConnect = mysql2.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
	dbConnect.on("connection", () => {
		console.log("Local DB connection established");
	});
	dbConnect.on("error", () => {
		console.log("DB connection could not be established");
	});
}

module.exports = dbConnect;
