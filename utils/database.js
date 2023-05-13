const mysql = require("mysql");
const mysql2 = require("mysql2");
const mysql2promise = require("mysql2/promise");
require("dotenv").config();
var dbConnect;
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
	pool.getConnection((err, connection) => {
		if (err) throw err;
		console.log("Pool connection established");
	});
	pool.on("connect", () => {
		console.log("DB pool connection established");
	});
	// var users;
	// dbConnect.query("SELECT * FROM users", function (err, rows, fields) {
	// 	if (err) throw err;

	// 	console.log("The solution is: ", rows);
	// 	users = rows;
	// 	console.log("Users:= ", users);
	// });
	pool.on("error", (err) => {
		console.log("JAWSDB connection could not be established", err);
	});
	// dbConnect = mysql.createConnection({
	// 	host: host,
	// 	user: user,
	// 	password: password,
	// 	database: database,
	// 	multipleStatements: true,
	// });
	// dbConnect.connect();
	// dbConnect.on("connect", () => {
	// 	console.log("DB connection established");
	// });
	// var users
	// dbConnect.query(
	// 	"SELECT * FROM users",
	// 	function (err, rows, fields) {
	// 		if (err) throw err;

	// 		console.log("The solution is: ", rows);
	// 		users = rows;
	//         console.log("Users:= ", users);
	// 	}
	// );
	// dbConnect.on("error", (err) => {
	// 	console.log("JAWSDB connection could not be established", err);
	// });

	// dbConnect.end()
// } else {
// 	pool = mysql2.createPool({
// 		host: process.env.DB_HOST,
// 		user: process.env.DB_USER,
// 		password: process.env.DB_PASSWORD,
// 		database: process.env.DB_DATABASE,
// 		multipleStatements: process.env.DB_MULTIPLE_STATEMENTS,
// 	});
// 	pool.on("connection", () => {
// 		console.log("Local DB connection established");
// 	});
// 	pool.on("error", () => {
// 		console.log("DB connection could not be established");
// 	});
	
// }
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

// module.exports = dbConnect;
module.exports = pool;

