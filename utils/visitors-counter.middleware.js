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
			console.log("visitors results: ", results[1][0][["COUNT(*)"]]);
			req.visitorsCount = results[1][0][["COUNT(*)"]];
			next();
		}
	);
};
// const visitorsCounterMiddleware = async (req, res, next) => {
// 	const ipAddress = req.body.ip;
// 	let visitorsCountResult;
// 	try {
// 		visitorsCountResult = await db.query(
// 			`INSERT INTO visitorscount (ipAddress) SELECT '${ipAddress}' WHERE NOT EXISTS (SELECT * FROM visitorscount WHERE ipAddress = '${ipAddress}');
//          SELECT COUNT(*) FROM visitorscount`
// 		);
// 	} catch (error) {
// 		console.log(error.message);
// 	}
// 	if (visitorsCountResult[0] && !visitorsCountResult[0][0]) {
// 		try {
// 			await db.query(`INSERT INTO visitorsCount (ipAddress) VALUES (?)`, [
// 				ipAddress,
// 			]);
// 		} catch (error) {
// 			console.log(error);
// 		}
//         req.visitorsCount = visitorsCountResult[0][1][0]["COUNT(*)"];
// 	}
// 	next();
// };

module.exports = visitorsCounterMiddleware;
