const { pool } = require("./database");
const xss = require("xss");

const existingUserMiddleware = (req, res, next) => {
	const username = xss(req.body.username);

	pool.query(
		`SELECT * FROM users WHERE username = '${username}'`,
		(error, results, fields) => {
			if (error) {
				return res.status(500).json({ error: "Unknown error." });
			}
			if (results[0]) {
				req.existingUser = results[0];
			} else {
				req.existingUser = null;
			}

			next();
		}
	);
};

module.exports = existingUserMiddleware;
