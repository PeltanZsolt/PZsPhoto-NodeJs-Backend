const mysql = require("mysql");
const mysql2 = require("mysql2/promise");
require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	console.log("JAWSDB_URL found. Initializing database...");
	const host = process.env.JAWSDB_URL.slice(42, 99);
	const user = process.env.JAWSDB_URL.slice(8, 24);
	const password = process.env.JAWSDB_URL.slice(25, 41);
	const database = process.env.JAWSDB_URL.slice(105);
	console.log("host=", host);
	console.log("user=", user);
	console.log("password=", password);
	console.log("database=", database);

	dbConnect = mysql2.createConnection({
		host: host,
		user: user,
		password: password,
		database: database,
		multipleStatements: true,
	});
	dbConnect.connect();
	dbConnect.on("connect", (mes) => {
		console.log("DB connection established", mes);
        const users = dbConnect.query("SELECT * FROM users");
        console.log("Users: ", users);
	});
	dbConnect.on("error", (err) => {
		console.log("JAWSDB connection could not be established", err);
	});
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
