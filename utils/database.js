const mysql2 = require("mysql2");
const mysql2promise = require("mysql2/promise");
require("dotenv").config();
var pool;
var poolPromise;

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

	poolPromise = mysql2promise.createPool({
		host: host,
		user: user,
		password: password,
		database: database,
		multipleStatements: true,
	});
	poolPromise.on("connect", () => {
		console.log("DB poolPromise connection established");
	});
	poolPromise.on("error", (err) => {
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
module.exports = {pool, poolPromise};

