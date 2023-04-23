const db = require("./database");

const existingUserMiddleware = async (req, res, next) => {
	const username = req.body.username;

	let existingUserCheck;
	try {
		existingUserCheck = await db.query(
			`SELECT * FROM users WHERE username = (?)`,
			username
		);
	} catch (error) {
		return res.status(500).json({ error: "Unknown error." });
	}

	if (existingUserCheck[0][0]) {
        req.existingUser = existingUserCheck[0][0];
    } else {
        req.existingUser = null;
	}

	next();
};

module.exports = existingUserMiddleware;
