const mysql2 = require("mysql2");
const mysql2promise = require("mysql2/promise");
require("dotenv").config();
var pool;
var poolPromise;

if (process.env.MARIADB_HOST) {
	console.log("Trying to connect to MariaDB...");
	pool = mysql2.createPool({
		host: process.env.MARIADB_HOST,
		user: process.env.MARIADB_USER,
		password: process.env.MARIADB_PASSWORD,
		database: process.env.MARIADB_DATABASE,
		multipleStatements: process.env.MARIADB_MULTIPLE_STATEMENTS,
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
	});
	// console.log('pool connection: ', pool)
	pool.on("connection", () => {
		console.log("MariaDB connection established");
	});
	pool.on("error", () => {
		console.log("MariaDB connection could not be established");
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

	poolPromise = mysql2promise.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
	});
	poolPromise.on("connect", () => {
		console.log("Local DB poolPromise connection established");
	});
	poolPromise.on("error", (err) => {
		console.log("LocalDB connection could not be established", err);
	});
}

module.exports = { pool, poolPromise };
