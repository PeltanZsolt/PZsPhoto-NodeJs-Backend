const db = require("./database");

const visitorsCounterMiddleware = (req, res, next) => {
	const ipAddress = req.body.ip;
	db.query(
		`INSERT INTO visitorscount (ipAddress) SELECT '${ipAddress}' WHERE NOT EXISTS (SELECT * FROM visitorscount WHERE ipAddress = '${ipAddress}');
         SELECT COUNT(*) FROM visitorscount`,
		(error, results, fields) => {
			if (error) {
				console.log("DB error: ", error);
				return res.json({ error: "Database error" });
			}
			req.visitorsCount = results[1][0][["COUNT(*)"]];
			next();
		}
	);
};

module.exports = visitorsCounterMiddleware;
