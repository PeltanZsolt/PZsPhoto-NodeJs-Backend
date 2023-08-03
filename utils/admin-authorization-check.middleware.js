const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const adminAuthCheck = async (req, res, next) => {
	const jwttoken = req.headers.jwttoken;

	try {
		jwt.verify(jwttoken, jwtSecretKey);
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	if (jwt.decode(jwttoken).username !== "Admin") {
		return res.status(403).json({ error: "Access forbidden" });
	}

	next();
};

module.exports = adminAuthCheck;
