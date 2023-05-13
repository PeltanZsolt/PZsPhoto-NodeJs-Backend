const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
require("dotenv").config();
var dbConnect;

// if (process.env.JAWSDB_URL) {
// console.log("JAWSDB_URL found. Initializing database...");
// console.log('jawsdb consts: =', process.env.JAWSDB_HOST, process.env.JAWSDB_USER, process.env.JAWSDB_PASSWORD, process.env.JAWSDB_DATABASE)
// dbConnect = mysql2.createPool({
// 	host: host,
// 	user: user,
// 	password: password,
// 	database: database,
// 	multipleStatements: true,
// });
// console.log('dbconnect:= ', dbConnect)
// dbConnect.on("connection", (mes) => {
// 	console.log("JAWSDB connection established", mes);
// });
// dbConnect.on("error", (err) => {
// 	console.log("JAWSDB connection could not be established", err);
// });

if (process.env.JAWSDB_URL) {
	console.log("JAWSDB_URL found. Initializing database...");
	const host = process.env.JAWSDB_URL.slice(42, 104);
	const user = process.env.JAWSDB_URL.slice(8, 24);
	const password = process.env.JAWSDB_URL.slice(25, 41);
	const database = process.env.JAWSDB_URL.slice(105);
	console.log("host=", host);
	console.log("user=", user);
	console.log("password=", password);
	console.log("database=", database);

	dbConnect = mysql.createConnection({
		host: host,
		user: user,
		password: password,
		database: database,
		multipleStatements: true,
	});
	// dbConnect = mysql.createConnection(process.env.JAWSDB_URL);
	dbConnect.connect();
	dbConnect.on("connection", (mes) => {
		console.log("DB connection established", mes);
	});
	dbConnect.on("error", (err) => {
		console.log("JAWSDB connection could not be established", err);
	});
	const users = dbConnect.query("SELECT * FROM users");
	console.log("Users: ", users);
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
