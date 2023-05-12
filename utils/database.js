require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	const mysql = require("mysql");
	dbConnect = mysql.createConnection(process.env.JAWSDB_URL);
	dbConnect.connect();
	initDB();
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

async function initDB() {
	await dbConnect.query(
		`
DROP TABLE IF EXISTS categories;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE 'categories' (
  'id' int NOT NULL AUTO_INCREMENT,
  'category' varchar(45) DEFAULT NULL,
  PRIMARY KEY ('id')
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES 'categories' WRITE;
/*!40000 ALTER TABLE 'categories' DISABLE KEYS */;
INSERT INTO categories VALUES (30,'still life'),(31,'portrait'),(32,'life'),(33,'commercial'),(34,'nature');
/*!40000 ALTER TABLE categories ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-12 14:51:35

        `
	);
}

module.exports = dbConnect;
