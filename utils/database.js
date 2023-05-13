const mysql2 = require("mysql2");
require("dotenv").config();
var pool;

if (process.env.JAWSDB_URL) {
	console.log("JAWSDB_URL found. Initializing database...");
	const host = process.env.JAWSDB_URL.slice(42, 99);
	const user = process.env.JAWSDB_URL.slice(8, 24);
	const password = process.env.JAWSDB_URL.slice(25, 41);
	const database = process.env.JAWSDB_URL.slice(105);

	pool = mysql2.createPool({
		host: host,
		user: user,
		password: password,
		database: database,
		multipleStatements: true,
	});
	pool.on("connect", () => {
		console.log("DB pool connection established");
	});
	pool.on("error", (err) => {
		console.log("JAWSDB connection could not be established", err);
	});
} else {
	pool = mysql2.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
	pool.on("connection", () => {
		console.log("Local DB connection established");
	});
	pool.on("error", () => {
		console.log("DB connection could not be established");
	});
	
}
module.exports = pool;

