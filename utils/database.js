require("dotenv").config();
var dbConnect;

if (process.env.JAWSDB_URL) {
	const mysql = require("mysql");
	dbConnect = mysql.createConnection(process.env.JAWSDB_URL);
	dbConnect.connect();
	dbConnect.on("connection", () => {
        console.log("DB connection established");
        initDB();
	});
	dbConnect.on("error", () => {
        console.log("JAWSDB connection could not be established");
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
    console.log('initialising jawsdb')
	const dbresult = await dbConnect.query(
		`
        CREATE SCHEMA pzsphotos ;
        USE pzsphotos;
        
        DROP TABLE IF EXISTS visitorscount;
        CREATE TABLE visitorscount (
          id int unsigned NOT NULL AUTO_INCREMENT,
          ipAddress varchar(45) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        
        DROP TABLE IF EXISTS categories;
        CREATE TABLE categories (
          id int NOT NULL AUTO_INCREMENT,
          category varchar(45) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        LOCK TABLES categories WRITE;
        INSERT INTO categories VALUES (30,'still life'),(31,'portrait'),(32,'life'),(33,'commercial'),(34,'nature');
        UNLOCK TABLES;
        
        DROP TABLE IF EXISTS comments;
        CREATE TABLE comments (
          photoId int DEFAULT NULL,
          user varchar(45) DEFAULT NULL,
          commentText text,
          rating int DEFAULT NULL,
          id int NOT NULL AUTO_INCREMENT,
          PRIMARY KEY (id),
          UNIQUE KEY id_UNIQUE (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=292 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        
        DROP TABLE IF EXISTS photos;
        CREATE TABLE photos (
          id int NOT NULL AUTO_INCREMENT,
          filename varchar(200) DEFAULT NULL,
          title varchar(50) DEFAULT NULL,
          category varchar(45) DEFAULT NULL,
          description varchar(2000) DEFAULT NULL,
          year varchar(45) DEFAULT NULL,
          place varchar(45) DEFAULT NULL,
          viewsNr int DEFAULT NULL,
          averageRating decimal(3,0) DEFAULT NULL,
          PRIMARY KEY (id),
          UNIQUE KEY id_UNIQUE (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        LOCK TABLES photos WRITE;
        UNLOCK TABLES;
        
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
          id int NOT NULL AUTO_INCREMENT,
          username varchar(45) DEFAULT NULL,
          password varchar(255) DEFAULT NULL,
          isAdmin enum('true','false') DEFAULT NULL,
          jwtToken varchar(255) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        LOCK TABLES users WRITE;
        INSERT INTO users VALUES (39,'Admin','$2a$12$IZeQSdK33xBS12W2vTFB0.veSIPfZ9bgO6PF3RBbQmMfZwNuppjJC','true','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwiaWF0IjoxNjgxNjY3NDkzfQ.7ZJIo1xEBwJQfhochfXvRrw-gYI4pqt_IHufq9k_vco'),(40,'User1','$2a$12$jpwsk8KhRU15bTgXNfd1weE7fa7oXPPe.LgGphD8zmxBPv7OGG4dS','true','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVzZXIxIiwiaWF0IjoxNjgxNzYwOTQ4fQ.J9QWSqjO48JjVcicmO3EoWi0qtqwz3ijSQTv-crO8C8'),(41,'User2','$2a$12$KE0DSA62qjxBhuS3QbsvW.mjfuWb11gt6bvbu7aMIVXS5erWnHS4K',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVzZXIyIiwiaWF0IjoxNjgxOTMwMTU4fQ.UzgRSbOFXsL74uqXqDh6YdS5W0SgOVNiZxzXtey91Hw'),(42,'User3','$2a$12$..1S7axMBVMPVAcNvifWGOa89/K9UnP7YNdCWd/3DGTRL1ZMNJJFK',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVzZXIzIiwiaWF0IjoxNjgyMDI0NzY0fQ.pWILxQv4Smzqb3ZE1bTIpSCou6dS5IjLLOSe2VTtZRo');
        UNLOCK TABLES;
        
        DROP TABLE IF EXISTS visitorscount;
        CREATE TABLE visitorscount (
          id int unsigned NOT NULL AUTO_INCREMENT,
          ipAddress varchar(45) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        LOCK TABLES visitorscount WRITE;
        INSERT INTO visitorscount VALUES (13,'85.66.213.28'),(14,'94.21.173.49'),(15,'81.16.205.32'),(16,'81.16.207.41'),(17,'185.182.212.120'),(18,'91.82.210.95'),(19,'85.67.47.125');
        UNLOCK TABLES;
        
        `
        );
        console.log('DB initailising result: ', dbresult)
}

module.exports = dbConnect;
