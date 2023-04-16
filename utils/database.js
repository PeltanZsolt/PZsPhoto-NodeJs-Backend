const mysql = require('mysql2/promise');

const dbConnect = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: 'mYeskuel',
   database: 'pzsphotos',
   multipleStatements: true,
});

module.exports = dbConnect;
