const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;


const userAuthCheck = async (req, res, next) => {
	const jwttoken = req.headers.jwttoken;

    try {
        jwt.verify(jwttoken, jwtSecretKey);
    } catch (error) {
        console.log(`jwttoken doesn't verify`);
        return res.status(401).json({ error: "Unauthorized" });
    }

	next();
};

module.exports = userAuthCheck;
